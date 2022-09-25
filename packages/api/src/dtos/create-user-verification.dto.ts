import pick from 'lodash.pick';
import type { VerificationInstance } from 'twilio/lib/rest/verify/v2/service/verification';

export class CreateUserVerification {
  'sid': string;
  'status': string;
  'channel': string;
  'createdAt': Date;
  'updatedAt': Date;

  constructor(data?: Partial<VerificationInstance>) {
    Object.assign(this, {
      ...pick(data, ['sid', 'status', 'channel', 'valid']),
      createdAt: data?.dateCreated,
      updatedAt: data?.dateUpdated,
    });
  }
}
