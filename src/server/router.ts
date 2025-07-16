import * as z from 'zod/v4-mini';

import { 
  PuzzleSpecSchema,
} from "@/game/types";

import {router, publicProcedure, sysopProcedure} from './trpc';
import {db} from './db';
import {
  puzzles,
} from './db/schema';

export const appRouter = router({
  getPuzzles: publicProcedure.query(async () => {
    try {
    const values = await db.query.puzzles.findMany({
      columns: {
        date: true,
        constraintA: true,
        constraintB: true,
        constraintC: true,
        constraint1: true,
        constraint2: true,
        constraint3: true,
      },
      orderBy: (puzzles, {desc}) => [desc(puzzles.date)],
      where: (puzzles, {lte}) => (lte(puzzles.date, new Date().toISOString())),
    });

    return values;
    } catch (err) {
      console.log(err);
    }
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
  .input(PuzzleSpecSchema)
  .mutation(async (opts) => {
    return await db.insert(puzzles).values(opts.input).returning();
  })
});

export type AppRouter = typeof appRouter;
