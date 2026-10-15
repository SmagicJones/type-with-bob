import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("lessons", "routes/lessons.tsx"),
  route("lessons/:lessonId", "routes/lesson.tsx"),
  route("lessons/:lessonId/results", "routes/lesson-results.tsx"),
  route("practice", "routes/practice.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
