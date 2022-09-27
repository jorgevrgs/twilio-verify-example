import fastifyAuth from '@fastify/auth';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import type { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
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
    hasVerificationInProgress: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
  interface Session {
    user?: UserDto;
    verification?: CreateVerificationDto;
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
          request.log.info('isAuthenticated', request.session.user);

          if (!request.session.user) {
            throw reply.unauthorized('You must be logged in');
          }
        }
      )
      .decorate(
        'hasVerificationInProgress',
        async (request: FastifyRequest, reply: FastifyReply) => {
          request.log.info('hasPermission', request.session.user);

          if (!request.session.verification) {
            throw reply.unauthorized(
              'You must have a verification in progress'
            );
          }

          if (request.session.verification.status === 'pending') {
            throw reply.unauthorized('You haven not verified your request');
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
  },
  { name: 'session', dependencies: ['twilio'] }
);
