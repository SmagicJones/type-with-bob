export type Hand = "left" | "right";

export type Finger =
  | "left-pinky"
  | "left-ring"
  | "left-middle"
  | "left-index"
  | "right-index"
  | "right-middle"
  | "right-ring"
  | "right-pinky"
  | "thumb";

/** A key that types a character, with or without Shift. */
export type CharKey = {
  kind: "char";
  /** Matches `KeyboardEvent.code` for the physical key. */
  id: string;
  base: string;
  shifted: string | null;
  finger: Finger;
  /** Width in key units; defaults to 1. */
  width?: number;
};

/** A key shown for orientation that types no character (Tab, Shift...). */
export type ControlKey = {
  kind: "control";
  id: string;
  label: string;
  finger: Finger;
  width?: number;
};

export type KeyDef = CharKey | ControlKey;

export type KeyboardLayout = {
  id: string;
  name: string;
  rows: readonly (readonly KeyDef[])[];
};

/** How to type one character: which key, which finger, and whether Shift is needed. */
export type KeyGuide = {
  char: string;
  key: CharKey;
  finger: Finger;
  /** The Shift key to hold (on the opposite hand), or null when not needed. */
  shiftKey: ControlKey | null;
};
