import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import type { VerificationListInstanceCreateOptions } from 'twilio/lib/rest/verify/v2/service/verification';
import { CreateVerificationDto } from '../../dtos';
import {
  CreateVerificationBody,
  CreateVerificationParams,
  createVerificationSchema,
} from '../../schemas';

const usersRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // Creates a verification
  fastify.route({
    url: '/create/:username',
    method: 'POST',
    schema: createVerificationSchema,
    handler: async function (
      request: FastifyRequest<{
        Params: CreateVerificationParams;
        Body: CreateVerificationBody;
      }>,
      reply: FastifyReply
    ) {
      const opts = {} as VerificationListInstanceCreateOptions;
      const { username } = request.params;
      const { phoneNumber, channel } = request.body;

      const user = await request.db?.collection('users').findOne({ username });

      if (!user && (!channel || !phoneNumber)) {
        throw reply.badRequest('Missing channel or phone number');
      }

      opts.channel = user?.defaultChannel || channel;
      opts.to = user?.phoneNumber || phoneNumber;

      const createdVerification =
        await request.twilioVerify.verifications.create(opts);

      request.log.info({ createdVerification });

      const verification = new CreateVerificationDto(createdVerification);

      request.log.info({ verification });
      request.session.verification = verification;

      return new CreateVerificationDto(verification);
    },
  });
};

export default usersRoute;
