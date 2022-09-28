import { ObjectId } from '@fastify/mongodb';
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import { UserDto } from '../../dtos';

export const changePasswordRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.route({
    url: '/change-password',
    method: 'PATCH',
    preHandler: fastify.auth([
      fastify.isAuthenticated,
      fastify.hasApprovedVerification,
    ]),
    handler: async (
      request: FastifyRequest<{
        Body: {
          currentPassword: string;
          newPassword: string;
          confirmPassword: string;
        };
      }>,
      reply: FastifyReply
    ) => {
      if (request.body.newPassword !== request.body.confirmPassword) {
        throw reply.badRequest('Passwords do not match');
      }

      const existingUser = await request.db
        ?.collection('users')
        .findOne({ _id: new ObjectId(request.session.user?.id) });

      if (!existingUser) {
        throw reply.notFound('User not found');
      }

      const isPasswordCorrect = await request.helpers.checkPassword(
        request.body.currentPassword,
        existingUser.password
      );

      if (!isPasswordCorrect) {
        throw reply.badRequest('Incorrect password');
      }

      const hashedPassword = await request.helpers.hashPassword(
        request.body.newPassword
      );

      await request.db
        ?.collection('users')
        .updateOne(
          { _id: new ObjectId(request.session.user?.id) },
          { $set: { password: hashedPassword } }
        );

      return new UserDto({
        ...existingUser,
        password: hashedPassword,
        verification: request.session.verification,
      });
    },
  });
};
