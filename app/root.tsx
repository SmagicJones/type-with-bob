import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { AppShell } from "./components/AppShell";
import { ButtonLink } from "./components/ui/ButtonLink";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <p>Loading Type with Bob…</p>
    </main>
  );
}

export default function App() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops! Something went wrong.";
  let details = "Sorry about that. Try going back to the home page.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error) && error.status === 404) {
    message = "Page not found";
    details = "We couldn't find that page.";
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <AppShell>
      <div className="flex flex-col items-start gap-4">
        <h1 className="text-3xl font-bold">{message}</h1>
        <p>{details}</p>
        <ButtonLink to="/">Go home</ButtonLink>
        {stack && (
          <pre className="w-full overflow-x-auto p-4">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </AppShell>
  );
}
