import { describe, expect, it } from "vitest";

import {
  aggregateKeyStats,
  getHistoryOverview,
  getRecentSeries,
} from "./aggregate";

describe("aggregateKeyStats", () => {
  it("returns nothing for no attempts", () => {
    expect(aggregateKeyStats([])).toEqual({});
  });

  it("sums attempts and errors across attempts", () => {
    const result = aggregateKeyStats([
      { keyStats: { f: { attempts: 4, errors: 1, avgLatencyMs: 200 } } },
      { keyStats: { f: { attempts: 6, errors: 2, avgLatencyMs: 300 } } },
    ]);

    expect(result.f?.attempts).toBe(10);
    expect(result.f?.errors).toBe(3);
  });

  it("weights average latency by correct keystrokes", () => {
    const result = aggregateKeyStats([
      { keyStats: { f: { attempts: 3, errors: 0, avgLatencyMs: 100 } } }, // weight 3
      { keyStats: { f: { attempts: 2, errors: 1, avgLatencyMs: 400 } } }, // weight 1
    ]);

    expect(result.f?.avgLatencyMs).toBe((3 * 100 + 1 * 400) / 4);
  });

  it("ignores missing latency and keeps keys that have none", () => {
    const result = aggregateKeyStats([
      { keyStats: { f: { attempts: 1, errors: 0, avgLatencyMs: null } } },
      { keyStats: { j: { attempts: 2, errors: 2, avgLatencyMs: null } } },
    ]);

    expect(result).toEqual({
      f: { attempts: 1, errors: 0, avgLatencyMs: null },
      j: { attempts: 2, errors: 2, avgLatencyMs: null },
    });
  });

  it("keeps different characters separate", () => {
    const result = aggregateKeyStats([
      { keyStats: { a: { attempts: 1, errors: 0, avgLatencyMs: 100 } } },
      { keyStats: { A: { attempts: 1, errors: 1, avgLatencyMs: null } } },
    ]);

    expect(Object.keys(result).sort()).toEqual(["A", "a"]);
  });
});

describe("getHistoryOverview", () => {
  const item = (completedAt: number, wpm: number, accuracy: number) => ({
    completedAt,
    wpm,
    accuracy,
  });

  it("returns null with no history", () => {
    expect(getHistoryOverview([])).toBeNull();
  });

  it("reports session count, best speed and recent averages", () => {
    const overview = getHistoryOverview(
      [item(3, 30, 90), item(1, 50, 80), item(2, 10, 100)],
      2,
    );

    expect(overview).toEqual({
      sessions: 3,
      bestWpm: 50,
      // The two most recent are completedAt 2 and 3.
      recentWpm: 20,
      recentAccuracy: 95,
    });
  });
});

describe("getRecentSeries", () => {
  it("returns the latest items, oldest first", () => {
    const items = [5, 1, 4, 2, 3].map((completedAt) => ({
      completedAt,
      wpm: completedAt,
      accuracy: 100,
    }));

    expect(getRecentSeries(items, 3).map((i) => i.completedAt)).toEqual([
      3, 4, 5,
    ]);
  });

  it("returns everything when there are fewer than the limit", () => {
    expect(
      getRecentSeries([{ completedAt: 1, wpm: 1, accuracy: 1 }]),
    ).toHaveLength(1);
  });
});
