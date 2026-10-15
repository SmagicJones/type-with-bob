import { useCallback } from "react";
import { data, isRouteErrorResponse, redirect, useSubmit } from "react-router";

import { ButtonLink } from "~/components/ui/ButtonLink";
import { getLayout } from "~/features/keyboard";
import {
  createLessonAttempt,
  curriculum,
  getLesson,
  getLessonStatuses,
  getLessonText,
  LessonScreen,
} from "~/features/lessons";
import { getCompletedLessonIds, getProgressStore } from "~/features/progress";
import type { SessionResult } from "~/features/typing-area";

import type { Route } from "./+types/lesson";

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: `${loaderData?.lesson.title ?? "Lesson"} – Type with Bob` }];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const lesson = getLesson(params.lessonId);
  if (!lesson) throw data("Lesson not found", { status: 404 });
  const progress = getProgressStore().load();
  const statuses = getLessonStatuses(
    curriculum,
    getCompletedLessonIds(progress),
  );
  return {
    lesson,
    text: getLessonText(lesson),
    status: statuses.get(lesson.id) ?? "locked",
    layoutId: progress.settings.layoutId,
  };
}

export async function clientAction({
  params,
  request,
}: Route.ClientActionArgs) {
  const lesson = getLesson(params.lessonId);
  if (!lesson) throw data("Lesson not found", { status: 404 });
  const attempt = createLessonAttempt(lesson, await request.json(), {
    id: crypto.randomUUID(),
    completedAt: Date.now(),
  });
  if (!attempt) throw data("Invalid result", { status: 400 });
  getProgressStore().addAttempt(attempt);
  return redirect(`/lessons/${lesson.id}/results`);
}

export default function LessonRoute({ loaderData }: Route.ComponentProps) {
  const { lesson, text, status, layoutId } = loaderData;
  const submit = useSubmit();
  const handleComplete = useCallback(
    (result: SessionResult) => {
      void submit(result, { method: "post", encType: "application/json" });
    },
    [submit],
  );

  return (
    <LessonScreen
      key={lesson.id}
      lesson={lesson}
      text={text}
      status={status}
      layout={getLayout(layoutId)}
      onComplete={handleComplete}
    />
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-3xl font-bold">
        {notFound
          ? "Lesson not found"
          : "Something went wrong with this lesson"}
      </h1>
      <p>
        {notFound
          ? "That lesson doesn't exist."
          : "Please try the lesson again."}
      </p>
      <ButtonLink to="/lessons">See all lessons</ButtonLink>
    </div>
  );
}
