import mongo, { FastifyMongodbOptions } from '@fastify/mongodb';
import fp from 'fastify-plugin';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly MONGO_URL: string;
    }
  }
}

/**
 * Fastify MongoDB connection plugin; with this you can share the same MongoDB connection pool in every part of your server.
 *
 * @see https://github.com/fastify/fastify-mongodb
 */
export default fp<FastifyMongodbOptions>(async (fastify, opts) => {
  fastify.register(mongo, {
    ...opts,
    // force to close the mongodb connection when app stopped
    // the default value is false
    forceClose: true,
    url: process.env.MONGO_URL,
  });
});
