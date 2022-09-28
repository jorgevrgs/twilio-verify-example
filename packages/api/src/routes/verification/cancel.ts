import { FastifyPluginAsync } from 'fastify';

export const cancelVerifyRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
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
