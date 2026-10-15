import { describe, expect, it } from "vitest";

import { toKeyRows } from "./keyRows";

describe("toKeyRows", () => {
  it("returns no rows for no stats", () => {
    expect(toKeyRows({})).toEqual([]);
  });

  it("calculates per-key accuracy", () => {
    expect(
      toKeyRows({ f: { attempts: 4, errors: 1, avgLatencyMs: 200 } }),
    ).toEqual([
      { char: "f", attempts: 4, errors: 1, accuracy: 75, avgLatencyMs: 200 },
    ]);
  });

  it("puts the least accurate keys first", () => {
    const rows = toKeyRows({
      a: { attempts: 10, errors: 0, avgLatencyMs: 100 },
      b: { attempts: 10, errors: 5, avgLatencyMs: 100 },
      c: { attempts: 10, errors: 2, avgLatencyMs: 100 },
    });

    expect(rows.map((r) => r.char)).toEqual(["b", "c", "a"]);
  });

  it("breaks accuracy ties by putting the slowest first, with no-latency keys last", () => {
    const rows = toKeyRows({
      a: { attempts: 1, errors: 0, avgLatencyMs: null },
      b: { attempts: 1, errors: 0, avgLatencyMs: 300 },
      c: { attempts: 1, errors: 0, avgLatencyMs: 500 },
    });

    expect(rows.map((r) => r.char)).toEqual(["c", "b", "a"]);
  });

  it("breaks remaining ties alphabetically", () => {
    const rows = toKeyRows({
      b: { attempts: 1, errors: 0, avgLatencyMs: 100 },
      a: { attempts: 1, errors: 0, avgLatencyMs: 100 },
    });

    expect(rows.map((r) => r.char)).toEqual(["a", "b"]);
  });

  it("skips keys with no attempts", () => {
    expect(
      toKeyRows({ a: { attempts: 0, errors: 0, avgLatencyMs: null } }),
    ).toEqual([]);
  });
});
