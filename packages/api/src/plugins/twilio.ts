import type { FastifyPluginAsync } from 'fastify';
import twilio, { Twilio } from 'twilio';
import type { ServiceContext } from 'twilio/lib/rest/verify/v2/service';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly TWILIO_ACCOUNT_SID: string;
      readonly TWILIO_AUTH_TOKEN: string;
      readonly TWILIO_VERIFY_SERVICE_SID: string;
    }
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    twilio: Twilio;
  }
  interface FastifyRequest {
    twilioVerify: ServiceContext;
  }
}

export const twilioPlugin: FastifyPluginAsync = async (fastify, opts) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  const client = twilio(accountSid, authToken);

  fastify
    .decorate('twilio', client)
    .decorateRequest('twilioVerify', null)
    .addHook('onRequest', async (request) => {
      if (!request.twilioVerify) {
        request.twilioVerify = client.verify.v2.services(verifyServiceSid);
      }
    });
};
