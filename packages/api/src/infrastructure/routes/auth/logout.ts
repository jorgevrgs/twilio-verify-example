import { FastifyPluginAsync } from 'fastify';

export const logoutRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.post('/logout', async function (request, reply) {
    await request.session.destroy();

    return 'OK';
  });
};
