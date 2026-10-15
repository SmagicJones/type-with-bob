import { ProgressBar } from "~/components/ui/ProgressBar";
import {
  curriculum,
  getLessonStatuses,
  LessonMap,
  stages,
} from "~/features/lessons";
import { getCompletedLessonIds, getProgressStore } from "~/features/progress";

import type { Route } from "./+types/lessons";

export function meta(_args: Route.MetaArgs) {
  return [{ title: "Lessons – Type with Bob" }];
}

export async function clientLoader() {
  const completed = getCompletedLessonIds(getProgressStore().load());
  return {
    statuses: getLessonStatuses(curriculum, completed),
    completedCount: curriculum.filter((lesson) => completed.has(lesson.id))
      .length,
  };
}

export default function Lessons({ loaderData }: Route.ComponentProps) {
  const { statuses, completedCount } = loaderData;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Lessons</h1>
      <div className="flex flex-col gap-2">
        <p>
          {completedCount} of {curriculum.length} lessons complete
        </p>
        <ProgressBar
          label="Lessons complete"
          value={completedCount}
          max={curriculum.length}
        />
      </div>
      <LessonMap stages={stages} lessons={curriculum} statuses={statuses} />
    </div>
  );
}
