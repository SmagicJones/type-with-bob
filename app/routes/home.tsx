import { Link } from "react-router";

import { getLayout, LayoutPicker, layouts } from "~/features/keyboard";
import { ContinueLesson, curriculum, getNextLesson } from "~/features/lessons";
import { Bob } from "~/features/mascot";
import { getCompletedLessonIds, getProgressStore } from "~/features/progress";

import type { Route } from "./+types/home";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Type with Bob" },
    {
      name: "description",
      content: "A friendly touch-typing tutor for beginners.",
    },
  ];
}

export async function clientLoader() {
  const progress = getProgressStore().load();
  const completed = getCompletedLessonIds(progress);
  return {
    nextLesson: getNextLesson(curriculum, completed),
    completedCount: curriculum.filter((lesson) => completed.has(lesson.id))
      .length,
    isNewUser: progress.attempts.length === 0,
    layoutId: getLayout(progress.settings.layoutId).id,
  };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const form = await request.formData();
  const layoutId = form.get("layoutId");
  if (
    form.get("intent") === "set-layout" &&
    layouts.some((layout) => layout.id === layoutId)
  ) {
    getProgressStore().updateSettings({ layoutId: String(layoutId) });
  }
  return null;
}

const LINK_CARD =
  "flex flex-col gap-1 rounded-xl border-2 border-gray-200 p-5 hover:border-indigo-500 focus-visible:outline-4 focus-visible:outline-indigo-600 dark:border-gray-700";

export default function Home({ loaderData }: Route.ComponentProps) {
  const { nextLesson, completedCount, isNewUser, layoutId } = loaderData;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Type with Bob</h1>
        <Bob
          mood={isNewUser ? "idle" : "happy"}
          message={
            isNewUser
              ? "Hi, I'm Bob! Let's learn to touch type, one key at a time."
              : "Welcome back! Ready for some more typing?"
          }
        />
      </header>

      <ContinueLesson
        nextLesson={nextLesson}
        completedCount={completedCount}
        totalCount={curriculum.length}
      />

      <nav
        aria-label="More ways to practise"
        className="grid gap-4 sm:grid-cols-3"
      >
        <Link to="/lessons" className={LINK_CARD}>
          <span className="text-lg font-semibold">All lessons</span>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            See the full lesson map.
          </span>
        </Link>
        <Link to="/practice" className={LINK_CARD}>
          <span className="text-lg font-semibold">Free practice</span>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Type words, stories or proverbs.
          </span>
        </Link>
        <Link to="/stats" className={LINK_CARD}>
          <span className="text-lg font-semibold">Your stats</span>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Speed, accuracy and tricky keys.
          </span>
        </Link>
      </nav>

      <section
        aria-labelledby="settings-heading"
        className="flex flex-col gap-3"
      >
        <h2 id="settings-heading" className="text-xl font-semibold">
          Settings
        </h2>
        <LayoutPicker currentLayoutId={layoutId} />
      </section>
    </div>
  );
}
