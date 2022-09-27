import { ObjectId } from '@fastify/mongodb';
import { FastifyPluginAsync } from 'fastify';
import { CreateVerificationDto } from '../../dtos';
import { channel } from '../../schemas/auth.schema';

const usersRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // Creates a verification
  fastify.route({
    url: '/create',
    method: 'POST',
    handler: async function (request, reply) {
      const currentUser = await request.db
        ?.collection('users')
        .findOne({ _id: new ObjectId(request.session.user?.id) });

      if (!currentUser) {
        throw reply.notFound('User not found');
      }

      const createdVerification =
        await request.twilioVerify.verifications.create({
          to: currentUser.phoneNumber,
          channel: currentUser.channel || channel.sms,
        });

      request.log.info({ createdVerification });

      const verification = new CreateVerificationDto(createdVerification);

      request.log.info({ verification });
      request.session.verification = verification;

      return new CreateVerificationDto(verification);
    },
  });
};

export default usersRoute;
