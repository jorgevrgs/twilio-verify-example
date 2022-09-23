import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';

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
      return request.twilioVerify.verifications.create({
        to: request.body.phoneNumber,
        channel: 'sms',
      });
    }
  );
};

export default authRoute;
