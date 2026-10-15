import type {
  CharKey,
  ControlKey,
  Finger,
  Hand,
  KeyboardLayout,
  KeyDef,
  KeyGuide,
} from "./types";

export function handOf(finger: Finger): Hand | null {
  if (finger.startsWith("left-")) return "left";
  if (finger.startsWith("right-")) return "right";
  return null;
}

const FINGER_NAMES: Record<Finger, string> = {
  "left-pinky": "left little finger",
  "left-ring": "left ring finger",
  "left-middle": "left middle finger",
  "left-index": "left index finger",
  "right-index": "right index finger",
  "right-middle": "right middle finger",
  "right-ring": "right ring finger",
  "right-pinky": "right little finger",
  thumb: "thumb",
};

export function fingerName(finger: Finger): string {
  return FINGER_NAMES[finger];
}

function allKeys(layout: KeyboardLayout): KeyDef[] {
  return layout.rows.flat();
}

function findControlKey(layout: KeyboardLayout, id: string): ControlKey | null {
  const key = allKeys(layout).find((k) => k.id === id);
  return key?.kind === "control" ? key : null;
}

/** The key that types `char`, or null if the layout cannot type it. */
export function findCharKey(
  layout: KeyboardLayout,
  char: string,
): { key: CharKey; shift: boolean } | null {
  for (const key of allKeys(layout)) {
    if (key.kind !== "char") continue;
    if (key.base === char) return { key, shift: false };
    if (key.shifted === char) return { key, shift: true };
  }
  return null;
}

/** A readable name for a character, so spaces and symbols are clear in text. */
export function charName(char: string): string {
  return char === " " ? "Space" : char;
}

/** A plain-English instruction, for example "F – left index finger, with right Shift". */
export function describeGuide(guide: KeyGuide): string {
  const base = `${charName(guide.char)} – ${fingerName(guide.finger)}`;
  if (!guide.shiftKey) return base;
  const side = guide.shiftKey.id === "ShiftLeft" ? "left" : "right";
  return `${base}, with ${side} Shift`;
}

/**
 * How to type `char`: the key, the finger, and the Shift key to hold.
 * Shift is held with the opposite hand to the key, as touch typists do.
 */
export function getKeyGuide(
  layout: KeyboardLayout,
  char: string,
): KeyGuide | null {
  const found = findCharKey(layout, char);
  if (!found) return null;

  const { key, shift } = found;
  const shiftKey = shift
    ? findControlKey(
        layout,
        handOf(key.finger) === "left" ? "ShiftRight" : "ShiftLeft",
      )
    : null;

  return { char, key, finger: key.finger, shiftKey };
}
