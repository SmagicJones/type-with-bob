import { NavLink } from "react-router";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/lessons", label: "Lessons", end: false },
  { to: "/practice", label: "Practice", end: false },
  { to: "/stats", label: "Stats", end: false },
];

function linkClasses({ isActive }: { isActive: boolean }): string {
  return `rounded-md px-3 py-2 font-medium focus-visible:outline-4 focus-visible:outline-indigo-600 ${
    isActive
      ? "bg-indigo-100 text-indigo-900 underline underline-offset-4 dark:bg-indigo-950 dark:text-indigo-100"
      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
  }`;
}

export function SiteHeader() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <NavLink to="/" className="text-xl font-bold">
          Type with Bob
        </NavLink>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-1">
            {LINKS.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink to={to} end={end} className={linkClasses}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
