import { createHTTPServer } from '@trpc/server/adapters/standalone';

import {router, publicProcedure} from './trpc';



const appRouter = router({
  dailyPuzzle: publicProcedure
    .query(async () => {
      
    }),

  startPuzzle: publicProcedure
    .query(async () => {
      
    }),
  updatePuzzle: publicProcedure
    .query(async () => {
      
    }),


});

const server = createHTTPServer({
  router: appRouter,
});
 
server.listen(8085);
