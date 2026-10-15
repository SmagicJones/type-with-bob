import type { ReactNode } from "react";

import { SiteHeader } from "./SiteHeader";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:outline-4 focus:outline-indigo-600 dark:focus:bg-gray-900"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-5xl px-4 py-8">
        {children}
      </main>
    </>
  );
}
