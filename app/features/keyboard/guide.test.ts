import { describe, expect, it } from "vitest";

import { describeGuide, fingerName, getKeyGuide, handOf } from "./guide";
import { getLayout } from "./layouts";

const uk = getLayout("uk-qwerty");

describe("getKeyGuide", () => {
  it("guides a lowercase letter without Shift", () => {
    const guide = getKeyGuide(uk, "f");

    expect(guide?.key.id).toBe("KeyF");
    expect(guide?.finger).toBe("left-index");
    expect(guide?.shiftKey).toBeNull();
  });

  it("uses the right Shift for a left-hand capital", () => {
    expect(getKeyGuide(uk, "F")?.shiftKey?.id).toBe("ShiftRight");
  });

  it("uses the left Shift for a right-hand capital", () => {
    expect(getKeyGuide(uk, "J")?.shiftKey?.id).toBe("ShiftLeft");
  });

  it("uses the left Shift for shifted right-hand symbols", () => {
    expect(getKeyGuide(uk, "?")?.shiftKey?.id).toBe("ShiftLeft");
  });

  it("guides the space bar to the thumb", () => {
    expect(getKeyGuide(uk, " ")?.finger).toBe("thumb");
  });

  it("returns null for a character the layout cannot type", () => {
    expect(getKeyGuide(uk, "é")).toBeNull();
  });
});

describe("describeGuide", () => {
  it.each([
    ["f", "f – left index finger"],
    ["F", "F – left index finger, with right Shift"],
    [":", ": – right little finger, with left Shift"],
    [" ", "Space – thumb"],
  ])("describes %j", (char, description) => {
    const guide = getKeyGuide(uk, char);

    expect(guide && describeGuide(guide)).toBe(description);
  });
});

describe("handOf", () => {
  it.each([
    ["left-ring", "left"],
    ["right-index", "right"],
    ["thumb", null],
  ] as const)("puts %s on the %s hand", (finger, hand) => {
    expect(handOf(finger)).toBe(hand);
  });
});

describe("fingerName", () => {
  it("names fingers in plain English", () => {
    expect(fingerName("left-pinky")).toBe("left little finger");
    expect(fingerName("thumb")).toBe("thumb");
  });
});
