import { Twilio } from 'twilio';
import type { UserDto } from '../dtos';

export class DeviceManager {
  constructor(private readonly twilioClient: Twilio) {}

  async token(user: UserDto) {
    const type = 'push';

    const accessToken = await this.twilioClient.verify
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .accessTokens.create({
        factorType: type,
        identity: user.id,
      });

    return {
      token: accessToken.token,
      serviceSid: process.env.TWILIO_VERIFY_SERVICE_SID,
      identity: user.id,
      factorType: type,
    };
  }
}
