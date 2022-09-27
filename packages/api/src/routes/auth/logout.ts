import { FastifyPluginAsync } from 'fastify';

const authRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/logout', async function (request, reply) {
    await request.session.destroy();

    return 'OK';
  });
};

export default authRoute;
