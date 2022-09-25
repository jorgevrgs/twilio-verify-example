import fastifyAuth from '@fastify/auth';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import type { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { UserDto } from '../dtos';
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly SESSION_SECRET: string;
    }
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    isAuthenticated: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
  interface Session {
    user?: UserDto;
  }
}

/**
 * This plugins adds some cookies and session utilities
 *
 * @see https://github.com/fastify/session
 */
export default fp(
  async (fastify, opts) => {
    fastify
      .register(fastifyAuth)
      .register(fastifyCookie)
      .register(fastifySession, {
        secret: process.env.SESSION_SECRET,
        cookie: {
          secure: process.env.NODE_ENV === 'production',
        },
      })
      .decorate(
        'isAuthenticated',
        async (request: FastifyRequest, reply: FastifyReply) => {
          console.log('isAuthenticated', request.session.user);

          if (!request.session.user) {
            throw reply.unauthorized('You must be logged in');
          }
        }
      );
  },
  { name: 'session' }
);
