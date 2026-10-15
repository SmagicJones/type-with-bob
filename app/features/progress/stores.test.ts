import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createLocalStorageProgressStore,
  createMemoryProgressStore,
  getProgressStore,
  MAX_ATTEMPTS,
  STORAGE_KEY,
} from "./stores";
import { buildLessonAttempt } from "~/test-utils/progress";
import type { ProgressStore } from "./types";
import { createEmptyProgress } from "./validate";

function storeContract(name: string, makeStore: () => ProgressStore) {
  describe(`${name} (ProgressStore contract)`, () => {
    it("starts empty", () => {
      expect(makeStore().load()).toEqual(createEmptyProgress());
    });

    it("adds attempts in order", () => {
      const store = makeStore();
      const first = buildLessonAttempt();
      const second = buildLessonAttempt();

      store.addAttempt(first);
      store.addAttempt(second);

      expect(store.load().attempts).toEqual([first, second]);
    });

    it("keeps only the newest attempts beyond the limit", () => {
      const store = makeStore();
      const attempts = Array.from({ length: MAX_ATTEMPTS + 2 }, () =>
        buildLessonAttempt(),
      );

      attempts.forEach((attempt) => store.addAttempt(attempt));

      const kept = store.load().attempts;
      expect(kept).toHaveLength(MAX_ATTEMPTS);
      expect(kept[0]).toEqual(attempts[2]);
    });

    it("updates settings", () => {
      const store = makeStore();

      store.updateSettings({ layoutId: "us-qwerty" });

      expect(store.load().settings.layoutId).toBe("us-qwerty");
    });

    it("clears everything", () => {
      const store = makeStore();
      store.addAttempt(buildLessonAttempt());

      store.clear();

      expect(store.load()).toEqual(createEmptyProgress());
    });
  });
}

storeContract("memory store", () => createMemoryProgressStore());
storeContract("localStorage store", () => {
  localStorage.clear();
  return createLocalStorageProgressStore(localStorage);
});

describe("localStorage store", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists across store instances, as across a page reload", () => {
    const attempt = buildLessonAttempt();
    createLocalStorageProgressStore(localStorage).addAttempt(attempt);

    expect(
      createLocalStorageProgressStore(localStorage).load().attempts,
    ).toEqual([attempt]);
  });

  it("uses a versioned storage key", () => {
    createLocalStorageProgressStore(localStorage).addAttempt(
      buildLessonAttempt(),
    );

    expect(STORAGE_KEY).toMatch(/v1$/);
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
  });

  it("starts fresh when stored JSON is corrupt", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");

    expect(createLocalStorageProgressStore(localStorage).load()).toEqual(
      createEmptyProgress(),
    );
  });

  it("starts fresh when stored data has the wrong shape", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ attempts: "lots" }));

    expect(createLocalStorageProgressStore(localStorage).load()).toEqual(
      createEmptyProgress(),
    );
  });

  it("overwrites corrupt data on the next save", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    const store = createLocalStorageProgressStore(localStorage);
    const attempt = buildLessonAttempt();

    store.addAttempt(attempt);

    expect(store.load().attempts).toEqual([attempt]);
  });

  it("carries on without throwing when storage is full", () => {
    const full = {
      ...localStorage,
      getItem: () => null,
      setItem: () => {
        throw new DOMException("full", "QuotaExceededError");
      },
    } as unknown as Storage;
    const store = createLocalStorageProgressStore(full);

    expect(() => store.addAttempt(buildLessonAttempt())).not.toThrow();
  });

  it("starts fresh when reading storage throws", () => {
    const blocked = {
      getItem: () => {
        throw new DOMException("blocked", "SecurityError");
      },
    } as unknown as Storage;

    expect(createLocalStorageProgressStore(blocked).load()).toEqual(
      createEmptyProgress(),
    );
  });
});

describe("getProgressStore", () => {
  it("returns the same localStorage-backed store each time", () => {
    localStorage.clear();
    const store = getProgressStore();
    store.addAttempt(buildLessonAttempt());

    expect(getProgressStore()).toBe(store);
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
  });
});

describe("getProgressStore without localStorage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("falls back to memory when storage access throws", async () => {
    vi.resetModules();
    vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    const { getProgressStore: freshGet } = await import("./stores");

    const store = freshGet();
    store.addAttempt(buildLessonAttempt());

    expect(store.load().attempts).toHaveLength(1);
  });
});
