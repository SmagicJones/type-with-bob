import { Form } from "react-router";

import { Button } from "~/components/ui/Button";

import { layouts } from "./layouts";

type LayoutPickerProps = {
  currentLayoutId: string;
  className?: string;
};

/** Submits `layoutId` (with `intent=set-layout`) to the current route's action. */
export function LayoutPicker({
  currentLayoutId,
  className = "",
}: LayoutPickerProps) {
  return (
    <Form
      method="post"
      className={`flex flex-wrap items-end gap-3 ${className}`}
    >
      <input type="hidden" name="intent" value="set-layout" />
      <div className="flex flex-col gap-1">
        <label htmlFor="layout-select" className="font-medium">
          Keyboard layout
        </label>
        <select
          id="layout-select"
          name="layoutId"
          defaultValue={currentLayoutId}
          key={currentLayoutId}
          className="rounded-lg border-2 border-gray-300 bg-white px-3 py-2 focus-visible:outline-4 focus-visible:outline-indigo-600 dark:border-gray-700 dark:bg-gray-900"
        >
          {layouts.map((layout) => (
            <option key={layout.id} value={layout.id}>
              {layout.name}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" variant="secondary">
        Save
      </Button>
    </Form>
  );
}
