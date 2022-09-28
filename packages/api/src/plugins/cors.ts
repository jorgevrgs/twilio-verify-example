import cors, { FastifyCorsOptions } from '@fastify/cors';
import { FastifyPluginAsync } from 'fastify';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly FRONTEND_URL: string;
    }
  }
}

export const corsPlugin: FastifyPluginAsync = async (
  fastify,
  opts: FastifyCorsOptions
) => {
  fastify.register(
    cors,
    Object.assign(
      {
        origin: [
          process.env.FRONTEND_URL || 'http://localhost:3000',
          '*.twilio.com',
        ],
        credentials: true,
      },
      opts
    )
  );
};
