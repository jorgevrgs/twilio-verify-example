import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import { VerificationCheckListInstanceCreateOptions } from 'twilio/lib/rest/verify/v2/service/verificationCheck';
import { CreateVerificationDto } from '../../dtos';
import {
  VerificationCodeParams,
  VerifyCodeBody,
  verifyCodeSchema,
} from '../../schemas';

export const checkVerifyRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  // Creates a verification
  fastify.route({
    url: '/verify/:username',
    method: 'POST',
    schema: verifyCodeSchema,
    handler: async function (
      request: FastifyRequest<{
        Params: VerificationCodeParams;
        Body: VerifyCodeBody;
      }>,
      reply: FastifyReply
    ) {
      const opts: VerificationCheckListInstanceCreateOptions = {};

      const { username } = request.params;
      const { verificationCode, phoneNumber } = request.body;

      const user = await request.db?.collection('users').findOne({ username });

      opts.to = user?.phoneNumber || phoneNumber;
      opts.code = user?.verificationCode || verificationCode;

      const verificationCheckResult =
        await request.twilioVerify.verificationChecks.create(opts);

      const response = new CreateVerificationDto(verificationCheckResult);

      request.log.info({ response });
      request.session.verification = response;

      return response;
    },
  });
};
