import { MiddlewareFn, session } from 'grammy';
import { FileAdapter } from '@satont/grammy-file-storage';
import path from 'path';
import { ContextWithSession } from '../types/Storage';

export const getSessionMiddleware = (): MiddlewareFn<ContextWithSession> => session({
  getSessionKey: () => 'root',

  initial: () => ({
    lastStats: {},
  }),

  storage: new FileAdapter({
    dirName: path.resolve(__dirname, '../../db'),
  }),
});
