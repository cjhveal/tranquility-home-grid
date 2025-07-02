import * as React from 'react';

import clsx from 'clsx';
import { createLink, type LinkComponent } from '@tanstack/react-router';
import { Button as HeadlessButton } from '@headlessui/react';

export type ButtonColor =
  | "accent"
  | "gray"


export type ButtonVariant =
  | "solid"
  | "soft"
  | "surface"
  | "outline"

const BUTTON_VARIANTS: {
  [v in ButtonVariant]: {[c in ButtonColor]: string}
} = {
  "solid": {
    "accent": "",
    "gray": "text-gray-100 dark:text-gray-950 bg-gray-950 hover:bg-gray-900 dark:bg-gray-100 dark:hover:bg-gray-50",
  },
  "soft": {
    "accent": "",
    "gray": "",
  },
  "surface": {
    "accent": "",
    "gray": " dark:bg-gray-900",
  },
  "outline": {
    "accent": "",
    "gray": "inset-ring",
  },
}
const BUTTON_BASE_CLASSES = 'px-2 rounded cursor-pointer font-medium';

interface BaseButtonProps {
  variant?: ButtonVariant,
  buttonColor?: ButtonColor,
}

function getButtonVariantClasses(variant: ButtonVariant, buttonColor: ButtonColor) {
  return BUTTON_VARIANTS[variant][buttonColor];
}

export interface ButtonProps extends BaseButtonProps, React.ComponentProps<typeof HeadlessButton> {};
export function Button({variant = "solid", buttonColor = "gray", className, ...rest}: ButtonProps) {
  const variantClasses = getButtonVariantClasses(variant, buttonColor);

  return (
    <HeadlessButton
      {...rest}
      className={clsx(
        className,
        variantClasses,
        BUTTON_BASE_CLASSES,

      )}
    />
  );
}

interface BaseButtonLinkProps extends BaseButtonProps, React.AnchorHTMLAttributes<HTMLAnchorElement> {}
const BaseButtonLinkComponent = React.forwardRef<HTMLAnchorElement, BaseButtonLinkProps>(
  (props, ref) => {
    const {variant = "solid", buttonColor="gray", className, ...rest} = props;

    const variantClasses = getButtonVariantClasses(variant, buttonColor);

    return (
      <a 
        {...rest}
        ref={ref}
        className={clsx(
          className,
          variantClasses,
          BUTTON_BASE_CLASSES,
        )}
      />
    );
  }
);

const CreatedLinkComponent = createLink(BaseButtonLinkComponent);


export const ButtonLink: LinkComponent<typeof BaseButtonLinkComponent> = (props) => {
  return <CreatedLinkComponent preload="intent" {...props} />
}
