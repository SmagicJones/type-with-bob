import { useCallback } from "react";
import { data, redirect, useSubmit } from "react-router";

import { getLayout } from "~/features/keyboard";
import {
  createPracticeAttempt,
  DEFAULT_LENGTH_ID,
  DEFAULT_SOURCE_ID,
  generatePracticeText,
  getLength,
  getSource,
  parsePracticeParams,
  practiceSearch,
  PracticeScreen,
  PracticeSetup,
} from "~/features/practice";
import {
  getLatestPracticeAttempt,
  getProgressStore,
} from "~/features/progress";
import type { SessionResult } from "~/features/typing-area";

import type { Route } from "./+types/practice";

export function meta(_args: Route.MetaArgs) {
  return [{ title: "Free practice – Type with Bob" }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const progress = getProgressStore().load();
  const params = parsePracticeParams(new URL(request.url).searchParams);

  if (!params) {
    const last = getLatestPracticeAttempt(progress);
    return {
      mode: "setup" as const,
      defaultSourceId: last?.sourceId ?? DEFAULT_SOURCE_ID,
      defaultLengthId: last?.lengthId ?? DEFAULT_LENGTH_ID,
    };
  }

  if (params.seed === null) {
    // A fresh seed per session; it lives in the URL so a reload keeps the same text.
    const seed = Math.floor(Math.random() * 2 ** 31);
    throw redirect(`/practice${practiceSearch({ ...params, seed })}`);
  }

  const source = getSource(params.sourceId);
  const length = getLength(params.lengthId);
  if (!source || !length)
    throw data("Unknown practice settings", { status: 400 });
  return {
    mode: "session" as const,
    source,
    length,
    text: generatePracticeText(source, length.words, params.seed),
    layoutId: progress.settings.layoutId,
  };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const params = parsePracticeParams(new URL(request.url).searchParams);
  if (!params) throw data("Unknown practice settings", { status: 400 });
  const attempt = createPracticeAttempt(await request.json(), {
    id: crypto.randomUUID(),
    completedAt: Date.now(),
    sourceId: params.sourceId,
    lengthId: params.lengthId,
  });
  if (!attempt) throw data("Invalid result", { status: 400 });
  getProgressStore().addAttempt(attempt);
  return { attempt };
}

export default function Practice({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const submit = useSubmit();
  const handleComplete = useCallback(
    (result: SessionResult) => {
      void submit(result, { method: "post", encType: "application/json" });
    },
    [submit],
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Free practice</h1>
      {loaderData.mode === "setup" ? (
        <PracticeSetup
          defaultSourceId={loaderData.defaultSourceId}
          defaultLengthId={loaderData.defaultLengthId}
        />
      ) : (
        <PracticeScreen
          source={loaderData.source}
          length={loaderData.length}
          text={loaderData.text}
          layout={getLayout(loaderData.layoutId)}
          result={actionData?.attempt ?? null}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}
