import * as React from 'react';

import clsx from 'clsx';
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

type BaseButtonProps = {
  
}

export type ButtonProps = {
  variant?: ButtonVariant,
  buttonColor?: ButtonColor,
} & React.ComponentProps<typeof HeadlessButton>;
export function Button({variant = "solid", buttonColor = "gray", className, ...rest}: ButtonProps) {
  const variantClasses = BUTTON_VARIANTS[variant][buttonColor];

  return (
    <HeadlessButton
      {...rest}
      className={clsx(
        className,
        variantClasses,
        'px-2 rounded cursor-pointer font-medium'
      )}
    />
  );
}
