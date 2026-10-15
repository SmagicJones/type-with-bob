import { Form } from "react-router";

import { Button } from "~/components/ui/Button";

import { lengths, sources } from "./sources";

type PracticeSetupProps = {
  defaultSourceId: string;
  defaultLengthId: string;
};

const OPTION =
  "flex cursor-pointer gap-3 rounded-lg border-2 border-gray-200 p-3 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50 has-[:focus-visible]:outline-4 has-[:focus-visible]:outline-indigo-600 dark:border-gray-700 dark:has-[:checked]:border-indigo-400 dark:has-[:checked]:bg-indigo-950";

export function PracticeSetup({
  defaultSourceId,
  defaultLengthId,
}: PracticeSetupProps) {
  return (
    <Form method="get" className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-xl font-semibold">
          What would you like to type?
        </legend>
        {sources.map((source) => (
          <div key={source.id} className={OPTION}>
            <input
              type="radio"
              id={`source-${source.id}`}
              name="source"
              value={source.id}
              defaultChecked={source.id === defaultSourceId}
              aria-describedby={`source-${source.id}-description`}
              className="mt-1 accent-indigo-700"
            />
            <div>
              <label
                htmlFor={`source-${source.id}`}
                className="block cursor-pointer font-semibold"
              >
                {source.name}
              </label>
              <p
                id={`source-${source.id}-description`}
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                {source.description}
              </p>
            </div>
          </div>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-xl font-semibold">How long?</legend>
        <div className="flex flex-wrap gap-2">
          {lengths.map((length) => (
            <label key={length.id} className={OPTION}>
              <input
                type="radio"
                name="length"
                value={length.id}
                defaultChecked={length.id === defaultLengthId}
                className="accent-indigo-700"
              />
              <span>
                {length.name} ({length.words} words)
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <Button type="submit">Start practice</Button>
      </div>
    </Form>
  );
}
