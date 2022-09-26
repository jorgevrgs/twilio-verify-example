import cors, { FastifyCorsOptions } from '@fastify/cors';
import fp from 'fastify-plugin';

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-cors
 */
export default fp<FastifyCorsOptions>(
  async (fastify, opts) => {
    fastify.register(cors, opts);
  },
  { name: 'cors' }
);
