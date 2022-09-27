import { ObjectId } from '@fastify/mongodb';
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import { CreateVerificationDto } from '../../dtos';
import { VerifyCodeBody, verifyCodeSchema } from '../../schemas';

const usersRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // Creates a verification
  fastify.route({
    url: '/verify',
    method: 'POST',
    schema: verifyCodeSchema,
    preHandler: fastify.auth([fastify.isAuthenticated, fastify.hasPermission]),
    handler: async function (
      request: FastifyRequest<{
        Body: VerifyCodeBody;
      }>,
      reply: FastifyReply
    ) {
      const currentUser = await request.db
        ?.collection('users')
        .findOne({ _id: new ObjectId(request.session.user?.id) });

      if (!currentUser) {
        throw reply.notFound('User not found');
      }

      const verificationCheckResult =
        await request.twilioVerify.verificationChecks.create({
          to: currentUser.phoneNumber,
          code: request.body.verificationCode,
        });

      const response = new CreateVerificationDto(verificationCheckResult);

      request.log.info({ response });
      request.session.verification = response;

      return response;
    },
  });
};

export default usersRoute;
