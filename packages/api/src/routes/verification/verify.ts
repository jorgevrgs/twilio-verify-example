import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import { CreateVerificationDto } from '../../dtos';
import { VerifyCodeBody, verifyCodeSchema } from '../../schemas';

const usersRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // Creates a verification
  fastify.route({
    url: '/verify',
    method: 'POST',
    schema: verifyCodeSchema,
    handler: async function (
      request: FastifyRequest<{
        Body: VerifyCodeBody;
      }>,
      reply: FastifyReply
    ) {
      const verificationCheckResult =
        await request.twilioVerify.verificationChecks.create({
          to: request.body.phoneNumber,
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
