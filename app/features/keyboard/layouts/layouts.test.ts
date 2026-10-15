import { describe, expect, it } from "vitest";

import { findCharKey } from "../guide";
import type { KeyDef } from "../types";
import { DEFAULT_LAYOUT_ID, getLayout, layouts } from "./index";

const printableAscii = Array.from({ length: 126 - 32 + 1 }, (_, i) =>
  String.fromCharCode(32 + i),
);

describe.each(layouts.map((layout) => [layout.name, layout] as const))(
  "%s layout data",
  (_name, layout) => {
    const keys: KeyDef[] = layout.rows.flat();

    it("can type every printable ASCII character", () => {
      const missing = printableAscii.filter(
        (char) => findCharKey(layout, char) === null,
      );
      expect(missing).toEqual([]);
    });

    it("assigns a finger to every key", () => {
      expect(keys.filter((key) => !key.finger)).toEqual([]);
    });

    it("has unique key ids", () => {
      const ids = keys.map((key) => key.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("never maps one character to two keys", () => {
      const chars = keys.flatMap((key) =>
        key.kind === "char"
          ? [key.base, key.shifted].filter((c) => c !== null)
          : [],
      );
      expect(new Set(chars).size).toBe(chars.length);
    });

    it("uses single characters for every character key", () => {
      const bad = keys.filter(
        (key) =>
          key.kind === "char" &&
          (key.base.length !== 1 ||
            (key.shifted !== null && key.shifted.length !== 1)),
      );
      expect(bad).toEqual([]);
    });

    it("has a Shift key on each side", () => {
      const ids = keys.map((key) => key.id);
      expect(ids).toContain("ShiftLeft");
      expect(ids).toContain("ShiftRight");
    });

    it("puts the space bar under the thumbs", () => {
      expect(findCharKey(layout, " ")?.key.finger).toBe("thumb");
    });
  },
);

describe("UK QWERTY specifics", () => {
  const uk = getLayout("uk-qwerty");

  it.each([
    ["£", "Digit3"],
    ['"', "Digit2"],
    ["@", "Quote"],
    ["#", "Backslash"],
    ["\\", "IntlBackslash"],
  ])("types %s on %s", (char, keyId) => {
    expect(findCharKey(uk, char)?.key.id).toBe(keyId);
  });
});

describe("getLayout", () => {
  it("defaults to UK QWERTY", () => {
    expect(DEFAULT_LAYOUT_ID).toBe("uk-qwerty");
  });

  it("returns the requested layout", () => {
    expect(getLayout("us-qwerty").name).toBe("US QWERTY");
  });

  it("falls back to the default for an unknown id", () => {
    expect(getLayout("dvorak").id).toBe(DEFAULT_LAYOUT_ID);
  });
});
