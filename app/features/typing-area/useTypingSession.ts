import { useCallback, useReducer } from "react";

import {
  applyKey,
  createEngine,
  type EngineState,
} from "~/features/typing-engine";

type Action = { type: "key"; key: string; at: number };

function reducer(state: EngineState, action: Action): EngineState {
  return applyKey(state, action.key, action.at);
}

/**
 * Holds engine state for one pass through `target`. To start again or switch
 * text, remount the component using this hook (for example with a `key`).
 */
export function useTypingSession(target: string) {
  const [state, dispatch] = useReducer(reducer, target, createEngine);
  const handleKey = useCallback(
    (key: string, at: number) => dispatch({ type: "key", key, at }),
    [],
  );
  return { state, handleKey };
}
