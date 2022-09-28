import fastifyAuth from '@fastify/auth';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import { CreateVerificationDto, UserDto } from '../dtos';
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
    hasApprovedVerification: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
  interface Session {
    user?: UserDto;
    verification?: CreateVerificationDto;
  }
}

export const sessionPlugin: FastifyPluginAsync = async (fastify, opts) => {
  fastify
    .register(fastifyAuth)
    .register(fastifyCookie)
    .register(
      fastifySession,
      Object.assign(
        {
          secret: process.env.SESSION_SECRET,
          cookie: {
            secure: process.env.NODE_ENV === 'production',
          },
        },
        opts
      )
    )
    .decorate(
      'isAuthenticated',
      async (request: FastifyRequest, reply: FastifyReply) => {
        request.log.info('isAuthenticated', request.session.user);

        if (!request.session.user) {
          throw reply.unauthorized('You must be logged in');
        }
      }
    )
    .decorate(
      'hasApprovedVerification',
      async (request: FastifyRequest, reply: FastifyReply) => {
        request.log.info('hasApprovedVerification', request.session.user);

        // Only runs for logged in users with MFA enabled
        if (
          request.session.user?.enableMFA &&
          request.session.verification?.status === 'approved'
        ) {
          throw reply.forbidden('You must have permission to access this');
        }
      }
    );
};
