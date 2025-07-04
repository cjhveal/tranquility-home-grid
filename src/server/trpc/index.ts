import 'dotenv/config';
import { type CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';

import { initTRPC, TRPCError, } from '@trpc/server';
 
export async function createContext(opts: CreateHTTPContextOptions) {
  const {req} = opts;

  const auth = req.headers.authorization;

  const isAdmin = (process.env.SYSOP_AUTH_KEY && auth === process.env.SYSOP_AUTH_KEY);

  return { isAdmin };
}

type Context = Awaited<ReturnType<typeof createContext>>;

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create();
 
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async function isAuthed(opts) {
  const { ctx } = opts;

  if (!ctx.isAdmin) {
    throw new TRPCError({code: 'UNAUTHORIZED'});
  }

  return opts.next({
    ctx: {
      isAdmin: true,
    }
  });
});
