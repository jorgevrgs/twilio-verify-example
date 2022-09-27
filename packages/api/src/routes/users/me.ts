import { ObjectId } from '@fastify/mongodb';
import { FastifyPluginAsync } from 'fastify';
import { UserDto } from '../../dtos';

const usersRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get(
    '/me',
    { preHandler: fastify.auth([fastify.isAuthenticated]) },
    async function (request, reply) {
      console.log({ session: request.session.user?.id });

      const user = await request.db
        ?.collection('users')
        .findOne({ _id: new ObjectId(request.session.user?.id) });

      if (!user) {
        throw reply.notFound('User not found');
      }

      request.log.info({ verification: request.session.verification });

      return new UserDto({
        ...user,
        verification: request.session.verification,
      });
    }
  );
};

export default usersRoute;
