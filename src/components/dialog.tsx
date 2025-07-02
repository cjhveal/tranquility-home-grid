import * as React from 'react';

import clsx from 'clsx';

import {
  Dialog as HeadlessDialog,
  DialogBackdrop as HeadlessDialogBackdrop,
  DialogPanel as HeadlessDialogPanel,
  DialogTitle as HeadlessDialogTitle,
} from '@headlessui/react';

export type DialogProps = React.ComponentProps<typeof HeadlessDialog>;
export function Dialog({className, ...rest}: DialogProps) {
  return (
    <HeadlessDialog 
      {...rest} 
      className={clsx(
        className,
        '',
      )}
    />
  );
}

export type DialogBackdropProps = React.ComponentProps<typeof HeadlessDialogBackdrop>;
export function DialogBackdrop(props: DialogBackdropProps) {
  return <HeadlessDialogBackdrop {...props} className="fixed inset-0 bg-black/70" />
}

export type DialogTitleProps = React.ComponentProps<typeof HeadlessDialogTitle>; 
export function DialogTitle({className, ...rest}: DialogTitleProps) {
  return (
    <HeadlessDialogTitle
      {...rest} 
      className={clsx(
        className,
        '',
      )}
    />
  );
}
export type DialogPanelProps = React.ComponentProps<typeof HeadlessDialogPanel>; 
export function DialogPanel({className, ...rest}: DialogPanelProps) {
  return (<div className="fixed inset-0 flex w-screen items-start justify-center p-4 pt-16 md:pt-32">
    <HeadlessDialogPanel
      {...rest} 
      className={clsx(
        className,
        'max-w-2xl w-full space-y-4 rounded-lg border dark:border-violet-300 bg-white dark:bg-gray-900 p-4 dark:text-violet-50',
      )}
    />
  </div>
  );
}
