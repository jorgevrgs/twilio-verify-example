import { FastifyPluginAsync } from 'fastify';
import {
  createVerificationSchema,
  verifyCodeSchema,
} from '../../domain/schemas';

export const verificationRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  const verificationController =
    fastify.diContainer.cradle.verificationController;

  fastify
    .route({
      url: '/create/:username',
      method: 'POST',
      schema: createVerificationSchema,
      handler: verificationController.create,
    })
    .route({
      url: '/verify/:username',
      method: 'POST',
      schema: verifyCodeSchema,
      handler: verificationController.verify,
    });
};
