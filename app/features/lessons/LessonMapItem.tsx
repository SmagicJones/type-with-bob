import { Link } from "react-router";

import { LessonStatusBadge } from "./LessonStatusBadge";
import type { Lesson, LessonStatus } from "./types";

type LessonMapItemProps = {
  lesson: Lesson;
  status: LessonStatus;
};

export function LessonMapItem({ lesson, status }: LessonMapItemProps) {
  const content = (
    <>
      <span className="font-semibold">{lesson.title}</span>
      <LessonStatusBadge status={status} className="self-start" />
    </>
  );
  const base = "flex h-full flex-col gap-2 rounded-lg border-2 p-4";

  return (
    <li>
      {status === "locked" ? (
        <div
          className={`${base} border-dashed border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-400`}
        >
          {content}
        </div>
      ) : (
        <Link
          to={`/lessons/${lesson.id}`}
          className={`${base} border-gray-200 hover:border-indigo-500 focus-visible:outline-4 focus-visible:outline-indigo-600 dark:border-gray-700`}
        >
          {content}
        </Link>
      )}
    </li>
  );
}
