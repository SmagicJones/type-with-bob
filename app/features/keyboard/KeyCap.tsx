import { memo } from "react";

import { FINGER_STYLES } from "./fingerStyles";
import type { KeyDef, KeyTint } from "./types";

export type KeyCapState = "idle" | "next" | "shift";

type KeyCapProps = {
  keyDef: KeyDef;
  state: KeyCapState;
  tint?: KeyTint;
};

const STATE_STYLES: Record<KeyCapState, string> = {
  idle: "",
  // Outline thickness and style are the non-colour cues for the highlight.
  next: "z-10 outline-4 outline-offset-2 outline-indigo-600 font-bold motion-safe:scale-110 dark:outline-indigo-400",
  shift:
    "z-10 outline-4 outline-offset-2 outline-dashed outline-indigo-600 font-bold dark:outline-indigo-400",
};

function labelFor(keyDef: KeyDef): { main: string; upper: string | null } {
  if (keyDef.kind === "control") return { main: keyDef.label, upper: null };
  if (keyDef.base === " ") return { main: "Space", upper: null };
  if (/^[a-z]$/.test(keyDef.base))
    return { main: keyDef.base.toUpperCase(), upper: null };
  return { main: keyDef.base, upper: keyDef.shifted };
}

export const KeyCap = memo(function KeyCap({
  keyDef,
  state,
  tint,
}: KeyCapProps) {
  const { main, upper } = labelFor(keyDef);

  return (
    <div
      data-key-id={keyDef.id}
      data-state={state}
      style={{ flexGrow: keyDef.width ?? 1, flexBasis: 0 }}
      className={`relative flex h-10 min-w-0 flex-col items-center justify-center rounded-md border text-xs transition-transform motion-reduce:transition-none sm:h-12 sm:text-sm ${tint ? tint.className : FINGER_STYLES[keyDef.finger]} ${STATE_STYLES[state]}`}
    >
      {upper && <span className="leading-none opacity-70">{upper}</span>}
      <span className="max-w-full truncate px-0.5 leading-tight">{main}</span>
      {tint?.label && (
        <span className="text-[0.6rem] leading-none font-semibold sm:text-xs">
          {tint.label}
        </span>
      )}
    </div>
  );
});
