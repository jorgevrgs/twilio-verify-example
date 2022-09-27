import { FastifyPluginAsync } from 'fastify';

const usersRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // Cancel a pending verification
  fastify.route({
    url: '/cancel',
    method: 'POST',
    preHandler: fastify.auth([fastify.isAuthenticated]),
    handler: async function (request, reply) {
      request.session.verification = undefined;

      return 'OK';
    },
  });
};

export default usersRoute;
