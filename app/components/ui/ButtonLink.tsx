import type { ComponentProps } from "react";
import { Link } from "react-router";

import { buttonClasses, type ButtonVariant } from "./buttonStyles";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
};

/** A link that looks like a button, for navigation actions. */
export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}
