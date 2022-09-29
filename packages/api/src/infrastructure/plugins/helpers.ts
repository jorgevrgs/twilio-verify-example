import bcryptjs from 'bcryptjs';
import { FastifyPluginAsync } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    helpers: {
      hashPassword: (plainText: string) => Promise<string>;
      checkPassword: (
        plainText: string,
        hashedPassword: string
      ) => Promise<boolean>;
    };
  }
}

export const helpersPlugin: FastifyPluginAsync = async (fastify) => {
  const helpers = {
    hashPassword: async (plainText: string) => {
      const salt = await bcryptjs.genSalt(10);

      return bcryptjs.hash(plainText, salt);
    },

    checkPassword: async (plainText: string, hashedPassword: string) => {
      return bcryptjs.compare(plainText, hashedPassword);
    },
  };

  fastify
    .decorateRequest('helpers', null)
    .addHook('onRequest', async (request) => {
      if (!request.helpers) {
        request.helpers = helpers;
      }
    });
};
