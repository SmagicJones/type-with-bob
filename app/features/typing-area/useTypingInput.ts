import { useEffect, useRef, type RefObject } from "react";

/** Keys that only modify other keys; pressing them alone is not a keystroke. */
const MODIFIER_KEYS = new Set([
  "Shift",
  "Control",
  "Alt",
  "AltGraph",
  "Meta",
  "OS",
  "CapsLock",
  "NumLock",
  "ScrollLock",
  "Fn",
  "FnLock",
  "Hyper",
  "Super",
  "Symbol",
  "SymbolLock",
]);

/** Keys left to the browser so keyboard users can always move focus away. */
const PASS_THROUGH_KEYS = new Set(["Tab", "Escape"]);

export type KeyHandler = (key: string, at: number) => void;

/**
 * Captures keystrokes on `ref`'s element with a native keydown listener and
 * reports each one with a `performance.now()` timestamp. Contains no scoring:
 * deciding what a key means is the engine's job.
 *
 * - Modifier-only presses, IME composition and held-key repeats are ignored.
 * - Ctrl/Cmd shortcuts are left alone (except Ctrl+Alt, which is AltGr on
 *   Windows), as are Tab and Escape.
 * - Everything else has its default prevented, so Space does not scroll,
 *   Backspace does not navigate, and ' or / do not open quick find.
 */
export function useTypingInput(
  ref: RefObject<HTMLElement | null>,
  onKey: KeyHandler,
  enabled = true,
): void {
  const onKeyRef = useRef(onKey);

  useEffect(() => {
    onKeyRef.current = onKey;
  });

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.isComposing || MODIFIER_KEYS.has(event.key)) return;
      if (PASS_THROUGH_KEYS.has(event.key)) return;
      const isAltGr = event.ctrlKey && event.altKey;
      if ((event.ctrlKey || event.metaKey) && !isAltGr) return;

      event.preventDefault();
      if (event.repeat) return;
      onKeyRef.current(event.key, performance.now());
    }

    element.addEventListener("keydown", handleKeyDown);
    return () => element.removeEventListener("keydown", handleKeyDown);
  }, [ref, enabled]);
}
