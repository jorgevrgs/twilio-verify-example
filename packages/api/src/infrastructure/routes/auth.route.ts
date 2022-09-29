import { FastifyPluginAsync } from 'fastify';
import { loginSchema, registerSchema } from '../../domain/schemas';

export const loginRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  const authController = fastify.diContainer.cradle.authController;

  fastify
    .route({
      url: '/login',
      method: 'POST',
      schema: loginSchema,
      handler: authController.login,
    })
    .route({ url: '/logout', method: 'POST', handler: authController.logout })
    .route({
      url: '/register',
      method: 'POST',
      schema: registerSchema,
      handler: authController.register,
    });
};
