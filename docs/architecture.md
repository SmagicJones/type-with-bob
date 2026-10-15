# Architecture

The central rule: **the typing engine knows nothing about the UI, and the UI knows nothing about how the engine works internally.**

## The flow of a keystroke

```
keydown on the typing area
  └─ useTypingInput (typing-area)      filters modifiers, repeats, shortcuts; timestamps with performance.now()
       └─ useTypingSession (typing-area)  dispatches { key, at } to a reducer
            └─ applyKey (typing-engine)     pure: (state, key, at) → new state
                 └─ TypingText / VisualKeyboard / LiveStats re-render from state
```

When the passage is complete, `TypingSession` calls `onComplete` once with `{ summary, keyStats }` from `getSummary` and `getKeyStats`. The route submits that to its `clientAction`, which validates it (`parseSessionResult`), builds an attempt (`createLessonAttempt` / `createPracticeAttempt`) and saves it through the `ProgressStore`.

## Typing engine (`features/typing-engine`)

Pure TypeScript with no DOM, React or clocks (a lint rule enforces this). Timestamps are always passed in, so every behaviour is deterministic and unit-tested.

- **Stop-on-error:** a wrong key marks the character `incorrect` and the cursor waits; the right key then marks it `corrected`.
- **Backspace and other named keys are ignored:** with stop-on-error there is never a wrong character behind the cursor.
- **WPM** = (correct and corrected characters ÷ 5) ÷ minutes, and 0 when no time has passed.
- **Accuracy** = correct keystrokes ÷ all keystrokes. It reads 100% before typing starts.
- **Timer** starts on the first keystroke and stops on the last character.
- **Per-key stats** are keyed by the character that was expected. Latency is the time since the previous keystroke, taken from the correct keystroke only.

The engine also exports type guards (`isSummary`, `isKeyStats`) used to validate data arriving from forms or storage.

## UI around the engine (`features/typing-area`)

- `useTypingInput` attaches a native `keydown` listener to the focusable typing area (`role="textbox"`, so screen readers switch to focus mode). It contains no scoring.
- `TypingText` renders each character as a memoised `TypedChar` with primitive props, so a keystroke only re-renders the characters whose state changed. Mistakes carry an underline style as well as colour.
- `TypingSession` composes the text, live stats, the visual keyboard and an optional `companion` (Bob). Mistakes are announced through an `aria-live` region, and the passage itself is exposed as the typing area's description.

## Data, not code

- **Keyboard layouts** (`keyboard/layouts`) list keys with `KeyboardEvent.code` ids, base and shifted characters, and fingers. The visual keyboard and the guide (`getKeyGuide`) work from any layout.
- **Lessons** (`lessons/curriculum.ts`) list new keys, authored lines and pass thresholds. Lesson text is a seeded drill (`generateDrill`) followed by the authored lines. Tests check that each lesson uses only keys introduced so far.
- **Practice sources** (`practice/sources.ts`) list words or passages with a recorded origin.

## Persistence (`features/progress`)

`ProgressStore` has `load`, `addAttempt`, `updateSettings` and `clear`. There are two implementations sharing one contract test suite:

- **localStorage** under the versioned key `type-with-bob:progress:v1`. Every read is validated: corrupt or unreadable data starts fresh, bad attempts are dropped individually, and failed writes are ignored.
- **In-memory**, for tests and for browsers where storage is blocked.

Attempts are a discriminated union (`kind: "lesson" | "practice"`), capped at the newest 500. Lesson status (`locked | unlocked | complete`) is derived from passed attempts, not stored.

## Routes

Route modules (`app/routes`) stay thin. They load data in `clientLoader`, save in `clientAction`, and compose feature components. SPA mode means only the root is rendered at build time. Everything else runs in the browser.

| Path                         | Purpose                                        |
| ---------------------------- | ---------------------------------------------- |
| `/`                          | Welcome, continue, overview, layout setting    |
| `/lessons`                   | Lesson map                                     |
| `/lessons/:lessonId`         | Lesson screen                                  |
| `/lessons/:lessonId/results` | Latest attempt (redirects if there is none)    |
| `/practice`                  | Setup, or a session when `?source&length&seed` |
| `/stats`                     | Overview, trends, heatmap, history             |
| `*`                          | Friendly 404                                   |

## Testing

- **Unit and component tests** sit next to their code. Coverage thresholds are 90% lines and functions for the engine, stats and progress, and 80% overall.
- **Playwright specs** in `e2e/` cover every route's main journey against the production build. They include axe checks in light mode, dark mode and at phone width, and a reduced-motion check.
