import mongo, {
  FastifyMongodbOptions,
  FastifyMongoObject,
} from '@fastify/mongodb';
import { FastifyPluginAsync } from 'fastify';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly MONGO_URL: string;
    }
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    db: FastifyMongoObject['db'];
  }
}

export const mongoPlugin: FastifyPluginAsync = async (
  fastify,
  opts: FastifyMongodbOptions
) => {
  fastify
    .register(
      mongo,
      Object.assign(
        {
          forceClose: true,
          url: process.env.MONGO_URL,
        },
        opts
      )
    )
    .decorateRequest('db', null)
    .addHook('onRequest', async (request) => {
      if (!request.db) {
        request.db = fastify.mongo.db;
      }
    });
};
