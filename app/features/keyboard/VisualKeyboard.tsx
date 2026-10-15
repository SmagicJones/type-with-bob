import { useId } from "react";

import { describeGuide, getKeyGuide } from "./guide";
import { KeyCap, type KeyCapState } from "./KeyCap";
import type { KeyboardLayout, KeyTint } from "./types";

/** Keys without a tint are greyed out while tints are shown, so finger colours don't mix in. */
const UNTINTED: KeyTint = {
  className:
    "bg-gray-50 border-gray-200 text-gray-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400",
  label: "",
};

type VisualKeyboardProps = {
  layout: KeyboardLayout;
  /** The character to highlight, or null for no highlight. */
  nextChar: string | null;
  /** Per-key overlays, keyed by key id, for example a heatmap. */
  keyTints?: ReadonlyMap<string, KeyTint>;
  /** Caption to show when there is no next key to describe. */
  caption?: string;
  className?: string;
};

export function VisualKeyboard({
  layout,
  nextChar,
  keyTints,
  caption,
  className = "",
}: VisualKeyboardProps) {
  const captionId = useId();
  const guide = nextChar === null ? null : getKeyGuide(layout, nextChar);

  function stateFor(keyId: string): KeyCapState {
    if (guide?.key.id === keyId) return "next";
    if (guide?.shiftKey?.id === keyId) return "shift";
    return "idle";
  }

  return (
    <figure
      aria-labelledby={captionId}
      className={`mx-auto w-full max-w-3xl ${className}`}
    >
      {/* Visual aid only; the caption carries the same guidance as text. */}
      <div aria-hidden="true" className="flex flex-col gap-1 select-none">
        {layout.rows.map((row, index) => (
          <div key={index} className="flex gap-1">
            {row.map((keyDef) => (
              <KeyCap
                key={keyDef.id}
                keyDef={keyDef}
                state={stateFor(keyDef.id)}
                tint={
                  keyTints ? (keyTints.get(keyDef.id) ?? UNTINTED) : undefined
                }
              />
            ))}
          </div>
        ))}
      </div>
      <figcaption id={captionId} className="mt-3 text-center text-sm">
        {guide ? (
          <>
            Next key: <strong>{describeGuide(guide)}</strong>
          </>
        ) : (
          (caption ?? `${layout.name} keyboard`)
        )}
      </figcaption>
    </figure>
  );
}
