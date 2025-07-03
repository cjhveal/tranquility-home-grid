import {router, publicProcedure} from './trpc';

import {db} from './db';
import { puzzles } from './db/schema';

export const appRouter = router({
  dailyPuzzle: publicProcedure
    .query(async () => {
      db.query
    }),

  getPuzzleSchedules: publicProcedure
    .query(async () => {
      return { wow: 'yoooo!!' };
    }),

  getPuzzles: publicProcedure
    .query(async () => {
      db.select().from(puzzles).limit(10);
    }),

  startSolution: publicProcedure
    .query(async () => {
      
    }),
  updateSolution: publicProcedure
    .query(async () => {
      
    }),
});

export type AppRouter = typeof appRouter;
