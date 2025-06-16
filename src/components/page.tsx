import * as React from 'react';

export interface PageProps extends React.PropsWithChildren {}
export function Page({children}: PageProps) {
  return (<div className="min-h-screen w-full bg-white dark:bg-gray-950 dark:text-violet-100">
    {children}
  </div>);
}
