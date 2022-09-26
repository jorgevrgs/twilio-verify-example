import bcryptjs from 'bcryptjs';
import fp from 'fastify-plugin';

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

export default fp(
  async (fastify, opts) => {
    const helpers = {
      hashPassword: async (plainText: string) => {
        const salt = await bcryptjs.genSalt(10);

        return bcryptjs.hash(plainText, salt);
      },

      checkPassword: async (plainText: string, hashedPassword: string) => {
        return bcryptjs.compare(plainText, hashedPassword);
      },
    };

    fastify.decorateRequest('helpers', helpers);
  },
  { name: 'helpers' }
);
