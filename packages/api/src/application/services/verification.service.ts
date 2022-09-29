import type { HttpErrors } from '@fastify/sensible/lib/httpError';
import { UsersService } from '.';
import { ChannelOptions } from '../../domain/constants';
import { CreateVerificationDto } from '../../domain/dtos';
import { CreateVerificationBody, VerifyCodeBody } from '../../domain/schemas';
import { VerifyManager } from '../managers';

export class VerificationService {
  constructor(
    private readonly verifyManager: VerifyManager,
    private readonly usersService: UsersService,
    private readonly httpErrorsService: HttpErrors
  ) {}

  async createVerificationByUsername(
    username: string,
    { phoneNumber, channel }: CreateVerificationBody
  ) {
    const user = await this.usersService.findUserByUsername(username);

    if (!user && (!channel || !phoneNumber)) {
      throw this.httpErrorsService.badRequest(
        'Missing channel or phone number'
      );
    }

    const createdVerification = await this.verifyManager.createCode(
      user?.phoneNumber || (phoneNumber as string),
      user?.defaultChannel || (channel as ChannelOptions)
    );

    return new CreateVerificationDto(createdVerification);
  }

  async verifyCodeByUsername(
    username: string,
    { verificationCode, phoneNumber }: VerifyCodeBody
  ) {
    const user = await this.usersService.findUserByUsername(username);

    const verificationCheckResult = await this.verifyManager.verifyCode(
      user?.phoneNumber || (phoneNumber as string),
      verificationCode
    );

    return new CreateVerificationDto(verificationCheckResult);
  }
}
