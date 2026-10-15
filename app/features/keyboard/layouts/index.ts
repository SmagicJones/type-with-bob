import type { KeyboardLayout } from "../types";
import { ukQwerty } from "./ukQwerty";
import { usQwerty } from "./usQwerty";

/** Every available layout. Adding a layout means adding a data file here. */
export const layouts: readonly KeyboardLayout[] = [ukQwerty, usQwerty];

export const DEFAULT_LAYOUT_ID = ukQwerty.id;

export function getLayout(id: string): KeyboardLayout {
  return layouts.find((layout) => layout.id === id) ?? ukQwerty;
}
