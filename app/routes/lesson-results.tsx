import { data, redirect } from "react-router";

import { getLesson, getLessonAfter, LessonResults } from "~/features/lessons";
import { getLatestLessonAttempt, getProgressStore } from "~/features/progress";

import type { Route } from "./+types/lesson-results";

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    {
      title: `Results: ${loaderData?.lesson.title ?? "Lesson"} – Type with Bob`,
    },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const lesson = getLesson(params.lessonId);
  if (!lesson) throw data("Lesson not found", { status: 404 });
  const attempt = getLatestLessonAttempt(getProgressStore().load(), lesson.id);
  if (!attempt) throw redirect(`/lessons/${lesson.id}`);
  return { lesson, attempt, nextLesson: getLessonAfter(lesson.id) };
}

export default function LessonResultsRoute({
  loaderData,
}: Route.ComponentProps) {
  const { lesson, attempt, nextLesson } = loaderData;
  return (
    <LessonResults lesson={lesson} result={attempt} nextLesson={nextLesson} />
  );
}
