import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import pick from 'lodash.pick';
import { UserDto } from '../../../domain/dtos';
import { userByUsernameSchema, UsernameParams } from '../../../domain/schemas';

export const usernameRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.route({
    url: '/:username',
    method: 'GET',
    schema: userByUsernameSchema,
    handler: async function (
      request: FastifyRequest<{
        Params: UsernameParams;
      }>,
      reply: FastifyReply
    ) {
      const user = await request.db
        ?.collection('users')
        .findOne({ username: request.params.username });

      if (!user) {
        throw reply.notFound('User not found');
      }

      request.log.info({ verification: request.session.verification });

      return pick(new UserDto(user), ['id', 'enableMFA']);
    },
  });
};
