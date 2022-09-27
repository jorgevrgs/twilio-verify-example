import pick from 'lodash.pick';
import type { VerificationInstance } from 'twilio/lib/rest/verify/v2/service/verification';
import { channel } from '../schemas/auth.schema';

export class CreateVerificationDto {
  'channel': channel;
  'sid': string;
  'status': string;
  'valid': boolean;
  'createdAt': Date;
  'updatedAt': Date;

  constructor(
    data?: Partial<
      Pick<
        VerificationInstance,
        'sid' | 'status' | 'channel' | 'valid' | 'dateCreated' | 'dateUpdated'
      >
    >
  ) {
    Object.assign(this, {
      ...pick(data, ['sid', 'status', 'channel', 'valid']),
      createdAt: data?.dateCreated,
      updatedAt: data?.dateUpdated,
    });
  }
}
