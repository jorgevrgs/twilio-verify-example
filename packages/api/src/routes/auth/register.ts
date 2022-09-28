import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';
import { UserDto } from '../../dtos';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { registerSchema } from '../../schemas/auth.schema';

export const registerRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/register',
    method: 'POST',
    schema: registerSchema,
    handler: async function (request, reply) {
      const existingUser = await request.db
        ?.collection('users')
        .findOne({ username: request.body.username });

      if (existingUser) {
        throw reply.conflict('Username already exists');
      }

      const hashedPassword = await request.helpers.hashPassword(
        request.body.password
      );

      // Create user in database
      const usertToCreate = new CreateUserDto({
        username: request.body.username,
        password: hashedPassword,
        phoneNumber: request.body.phoneNumber,
        enableMFA: request.body.enableMFA,
      });

      const createdUser = await request.db
        ?.collection('users')
        .insertOne(usertToCreate);

      if (!createdUser?.insertedId.toString()) {
        throw reply.internalServerError('Failed to create user');
      }

      request.log.info({ createdUser });

      const response = new UserDto({
        ...usertToCreate,
        _id: createdUser.insertedId,
      });

      // Store user in session
      request.session.user = response;
      request.session.verification = undefined;

      request.log.info({ response });

      reply.status(201);
      return response;
    },
  });
};
