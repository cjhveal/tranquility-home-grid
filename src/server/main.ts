import { createHTTPServer } from '@trpc/server/adapters/standalone';

import { createContext } from './trpc';
import { appRouter }  from './router';

const server = createHTTPServer({
  router: appRouter,
  createContext,
});
 
server.listen(8085);
