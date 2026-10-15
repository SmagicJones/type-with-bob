import type { Attempt, ProgressData, ProgressStore, Settings } from "./types";
import { createEmptyProgress, parseProgressData } from "./validate";

/** Versioned so a future format can migrate or start fresh without clashing. */
export const STORAGE_KEY = "type-with-bob:progress:v1";

/** Older attempts beyond this are dropped to keep storage small. */
export const MAX_ATTEMPTS = 500;

function withAttempt(data: ProgressData, attempt: Attempt): ProgressData {
  return {
    ...data,
    attempts: [...data.attempts, attempt].slice(-MAX_ATTEMPTS),
  };
}

function withSettings(
  data: ProgressData,
  settings: Partial<Settings>,
): ProgressData {
  return { ...data, settings: { ...data.settings, ...settings } };
}

function createStore(
  read: () => ProgressData,
  write: (data: ProgressData) => void,
): ProgressStore {
  return {
    load: read,
    addAttempt: (attempt) => write(withAttempt(read(), attempt)),
    updateSettings: (settings) => write(withSettings(read(), settings)),
    clear: () => write(createEmptyProgress()),
  };
}

export function createMemoryProgressStore(
  initial: ProgressData = createEmptyProgress(),
): ProgressStore {
  let data = initial;
  return createStore(
    () => data,
    (next) => {
      data = next;
    },
  );
}

/**
 * Persists progress in Web Storage. Corrupt or missing data reads as a fresh
 * start. Failed writes (storage full or blocked) are ignored so typing is
 * never interrupted; progress simply is not saved.
 */
export function createLocalStorageProgressStore(
  storage: Storage,
  key = STORAGE_KEY,
): ProgressStore {
  return createStore(
    () => {
      try {
        const raw = storage.getItem(key);
        return raw === null
          ? createEmptyProgress()
          : parseProgressData(JSON.parse(raw));
      } catch {
        return createEmptyProgress();
      }
    },
    (data) => {
      try {
        storage.setItem(key, JSON.stringify(data));
      } catch {
        // Storage is full or unavailable; carry on without saving.
      }
    },
  );
}

function getBrowserStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    // Some browsers throw when storage is disabled.
    return null;
  }
}

let defaultStore: ProgressStore | null = null;

/** The app's store: localStorage in the browser, memory where that is unavailable. */
export function getProgressStore(): ProgressStore {
  if (!defaultStore) {
    const storage = getBrowserStorage();
    defaultStore = storage
      ? createLocalStorageProgressStore(storage)
      : createMemoryProgressStore();
  }
  return defaultStore;
}
