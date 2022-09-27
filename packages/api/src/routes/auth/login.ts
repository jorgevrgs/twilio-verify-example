import { ObjectId } from '@fastify/mongodb';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';
import { UserDto } from '../../dtos';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { loginSchema } from '../../schemas/auth.schema';

const authRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/login',
    method: 'POST',
    schema: loginSchema,
    handler: async function (request, reply) {
      const existingUser = await request.db
        ?.collection('users')
        .findOne({ username: request.body.username });

      request.log.info({ existingUser });

      if (!existingUser) {
        // Not clue what is going on here
        throw reply.notFound('Username or password is incorrect');
      }

      const isPasswordValid = await request.helpers.checkPassword(
        request.body.password,
        existingUser.password
      );

      request.log.info({ isPasswordValid });

      if (!isPasswordValid) {
        throw reply.notFound('Username or password is incorrect');
      }

      const usertToUpdate = new UpdateUserDto();

      request.log.info({ usertToUpdate });

      const updatedUser = await request.db
        ?.collection('users')
        .findOneAndUpdate(
          { _id: new ObjectId(existingUser._id) },
          {
            $set: {
              verification: usertToUpdate.verification,
            },
          },
          { returnDocument: 'after' }
        );

      if (!updatedUser?.value?._id.toString()) {
        throw reply.internalServerError('Failed to update user');
      }

      request.log.info({ updatedUser });

      const response = new UserDto(updatedUser.value);

      // Store user in session
      request.session.user = response;
      request.session.verification = undefined;

      request.log.info({ response });

      return response;
    },
  });
};

export default authRoute;
