import cors, { FastifyCorsOptions } from '@fastify/cors';
import fp from 'fastify-plugin';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly FRONTEND_URL: string;
    }
  }
}

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-cors
 */
export default fp<FastifyCorsOptions>(
  async (fastify, opts) => {
    fastify.register(cors, {
      ...opts,
      origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
      credentials: true,
    });
  },
  { name: 'cors' }
);
