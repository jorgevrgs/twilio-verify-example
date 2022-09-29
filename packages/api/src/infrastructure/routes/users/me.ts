import { ObjectId } from '@fastify/mongodb';
import { FastifyPluginAsync } from 'fastify';
import { UserDto } from '../../../domain/dtos';

export const meRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get(
    '/me',
    { preHandler: fastify.auth([fastify.isAuthenticated]) },
    async function (request, reply) {
      const user = await request.db
        ?.collection('users')
        .findOne({ _id: new ObjectId(request.session.user?.id) });

      if (!user) {
        throw reply.notFound('User not found');
      }

      return new UserDto({
        ...user,
        verification: request.session.verification,
      });
    }
  );
};
