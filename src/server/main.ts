import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';

import { createContext } from './trpc';
import { appRouter }  from './router';

const server = createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext,
});
 
server.listen(8085, () => console.log('listening'));
