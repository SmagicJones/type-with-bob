import { useId } from "react";

import { describeGuide, getKeyGuide } from "./guide";
import { KeyCap, type KeyCapState } from "./KeyCap";
import type { KeyboardLayout } from "./types";

type VisualKeyboardProps = {
  layout: KeyboardLayout;
  /** The character to highlight, or null for no highlight. */
  nextChar: string | null;
  className?: string;
};

export function VisualKeyboard({
  layout,
  nextChar,
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
          `${layout.name} keyboard`
        )}
      </figcaption>
    </figure>
  );
}
