import { Twilio } from 'twilio';
import { channel } from '../schemas';

export class VerifyManager {
  constructor(private readonly twilioClient: Twilio) {}

  createCode(to: string, channel: channel) {
    return this.twilioClient.verify
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to,
        channel,
      });
  }

  verifyCode(to: string, code: string) {
    return this.twilioClient.verify
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to,
        code,
      });
  }
}
