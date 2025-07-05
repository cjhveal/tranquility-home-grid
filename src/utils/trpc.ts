import { createTRPCContext } from '@trpc/tanstack-react-query';

import type { AppRouter } from '../server/router';
 
export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();


let sysopToken: string;

export function setSysopToken(token: string) {
  sysopToken = token;
}

export function getSysopToken(): undefined | string {
  return sysopToken;
}
