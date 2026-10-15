import { getLayout } from "~/features/keyboard";
import { getLesson } from "~/features/lessons";
import { getLength, getSource } from "~/features/practice";
import { getProgressStore, type Attempt } from "~/features/progress";
import { StatsOverview } from "~/features/stats";

import type { Route } from "./+types/stats";

export function meta(_args: Route.MetaArgs) {
  return [{ title: "Your stats – Type with Bob" }];
}

export async function clientLoader() {
  const { attempts, settings } = getProgressStore().load();
  return { attempts, layoutId: settings.layoutId };
}

function describeAttempt(attempt: Attempt): string {
  if (attempt.kind === "lesson") {
    return getLesson(attempt.lessonId)?.title ?? "Lesson";
  }
  const source = getSource(attempt.sourceId)?.name ?? "Practice";
  const length = getLength(attempt.lengthId)?.name.toLowerCase();
  return length ? `${source} (${length})` : source;
}

export default function Stats({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Your stats</h1>
      <StatsOverview
        attempts={loaderData.attempts}
        layout={getLayout(loaderData.layoutId)}
        describeAttempt={describeAttempt}
      />
    </div>
  );
}
