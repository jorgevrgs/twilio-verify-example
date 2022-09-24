import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import { omit } from 'lodash-es';

const authRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/register',
    {
      schema: {
        body: Type.Object({
          username: Type.String(),
          password: Type.String({ minLength: 6 }),
          phoneNumber: Type.String({ minLength: 10 }),
          enableMFA: Type.Boolean({ default: true }),
        }),
      },
    },
    async function (request, reply) {
      const existingUser = await request.db
        ?.collection('users')
        .findOne({ username: request.body.username });

      if (existingUser) {
        throw reply.conflict('Username already exists');
      }

      const result = await request.twilioVerify.verifications.create({
        to: request.body.phoneNumber,
        channel: 'sms',
      });

      const hashedPassword = await request.helpers.hashPassword(
        request.body.password
      );

      const verification = {
        sid: result.sid,
        status: result.status,
      };

      // Create user in database
      const newUser = await request.db?.collection('users').insertOne({
        username: request.body.username,
        password: hashedPassword,
        phoneNumber: request.body.phoneNumber,
        enableMFA: request.body.enableMFA,
        verification,
      });

      reply.status(201);

      return omit(
        {
          id: newUser?.insertedId,
          verification,
          ...request.body,
        },
        ['password']
      );
    }
  );
};

export default authRoute;
