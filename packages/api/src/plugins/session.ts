import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import fp from 'fastify-plugin';
import { User } from '../types';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly SESSION_SECRET: string;
    }
  }
}

declare module 'fastify' {
  interface Session {
    user?: User;
  }
}

/**
 * This plugins adds some cookies and session utilities
 *
 * @see https://github.com/fastify/session
 */
export default fp(async (fastify, opts) => {
  fastify.register(fastifyCookie).register(fastifySession, {
    secret: process.env.SESSION_SECRET,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
    },
  });
});
