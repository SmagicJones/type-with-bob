import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useNow } from "./useNow";

describe("useNow", () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ["setInterval", "clearInterval", "performance"],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("ticks while active", () => {
    const { result } = renderHook(() => useNow(true, 1000));
    const start = result.current;

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current - start).toBe(3000);
  });

  it("does not tick while inactive", () => {
    const { result } = renderHook(() => useNow(false, 1000));
    const start = result.current;

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current).toBe(start);
  });

  it("stops ticking when it becomes inactive", () => {
    const { result, rerender } = renderHook(({ active }) => useNow(active), {
      initialProps: { active: true },
    });

    rerender({ active: false });
    const stoppedAt = result.current;
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current).toBe(stoppedAt);
  });
});
