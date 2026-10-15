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

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Type with Bob</h1>
      <p className="mt-2">Learn to touch type, one key at a time.</p>
    </div>
  );
}
