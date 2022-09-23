import { FastifyPluginAsync } from 'fastify';

const authRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/register', async function (request, reply) {
    return {
      id: '123',
      username: 'test',
      phoneNumber: '123',
      isPhoneNumberVerified: false,
      isMfaEnabled: false,
    };
  });
};

export default authRoute;
