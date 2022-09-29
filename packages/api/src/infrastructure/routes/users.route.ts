import type { FastifyPluginAsync } from 'fastify';
import { userByUsernameSchema } from '../../domain/schemas';

export const usersRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  const usersController = fastify.diContainer.cradle.usersController;

  fastify
    .route({
      url: '/change-password',
      method: 'PATCH',
      preHandler: fastify.auth([
        fastify.isAuthenticated,
        fastify.hasApprovedVerification,
      ]),
      handler: usersController.changePassword,
    })
    .route({
      url: '/me',
      method: 'GET',
      preHandler: fastify.auth([fastify.isAuthenticated]),
      handler: usersController.getCurrentUser,
    })
    .route({
      url: '/:username',
      method: 'GET',
      schema: userByUsernameSchema,
      handler: usersController.getUserByUsername,
    });
};
