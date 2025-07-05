import * as z from 'zod/v4-mini';
import {router, publicProcedure, sysopProcedure} from './trpc';

import {db} from './db';
import {puzzles, schedules} from './db/schema';

export const appRouter = router({
  getPuzzleSchedules: publicProcedure.query(async () => {
    try {
    const values = await db.query.schedules.findMany({
      columns: {
        date: true,
      },
      orderBy: (schedules, {desc}) => [desc(schedules.date)],
      where: (schedules, {lte}) => (lte(schedules.date, new Date())),
      with: { puzzle: {
        columns: {
          constraintA: true,
          constraintB: true,
          constraintC: true,
          constraint1: true,
          constraint2: true,
          constraint3: true,
        },
      }},
    });

    return values;
    } catch (err) {
      console.log(err);
    }
  }),

  getPuzzles: publicProcedure
    .query(async () => {
    }),

  startSolution: publicProcedure
    .query(async () => {
      
    }),
  updateSolution: publicProcedure
    .query(async () => {
      
    }),

  sysopTest: sysopProcedure
  .input(z.object({
    test: z.string(),
  }))
  .mutation(async (opts) => {
    console.log('SUCCESS!!!', opts.input.test);

    return { success: true };
  }),

  createPuzzle: sysopProcedure
  .mutation(async (opts) => {
    /*
    db.insert(puzzles).values({
    })
    */
  })
});

export type AppRouter = typeof appRouter;
