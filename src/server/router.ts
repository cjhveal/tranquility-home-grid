import {router, publicProcedure} from './trpc';

import {db} from './db';

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
});

export type AppRouter = typeof appRouter;
