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
    preHandler: fastify.auth([
      fastify.isAuthenticated,
      fastify.hasVerificationInProgress,
    ]),
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

      // update user isPhoneNumberVerified
      await request.db
        ?.collection('users')
        .updateOne(
          { _id: new ObjectId(request.session.user?.id) },
          { $set: { isPhoneNumberVerified: true } }
        );

      return response;
    },
  });
};

export default usersRoute;
