import { ButtonLink } from "~/components/ui/ButtonLink";

import type { Route } from "./+types/not-found";

export function meta(_args: Route.MetaArgs) {
  return [{ title: "Page not found – Type with Bob" }];
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p>We couldn't find that page. Let's get you back to typing.</p>
      <ButtonLink to="/">Go home</ButtonLink>
    </div>
  );
}
