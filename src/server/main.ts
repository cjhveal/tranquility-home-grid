import { createHTTPServer } from '@trpc/server/adapters/standalone';

import {router, publicProcedure} from './trpc';

import {db} from './db';
import { puzzleTable } from './db/schema';


const appRouter = router({
  dailyPuzzle: publicProcedure
    .query(async () => {
      db.query
    }),

  getPuzzles: publicProcedure
    .query(async () => {
      db.select().from(puzzleTable).limit(10);
    }),

  startSolution: publicProcedure
    .query(async () => {
      
    }),
  updateSolution: publicProcedure
    .query(async () => {
      
    }),


});

const server = createHTTPServer({
  router: appRouter,
});
 
server.listen(8085);
