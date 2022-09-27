import omit from 'lodash.omit';
import type { Document } from 'mongodb';
import { channel } from '../schemas/auth.schema';
import { CreateFactor } from './create-factor';
import { CreateVerificationDto } from './create-verification.dto';

/**
 * User information to be returned to the client
 */
export class UserDto {
  'defaultChannel': channel = channel.sms;
  'enableMFA': boolean;
  'factor'?: CreateFactor;
  'id': string;
  'isPhoneNumberVerified': boolean = false;
  'phoneNumber': string;
  'status': 'unconfirmed' | 'confirmed' = 'unconfirmed';
  'username': string;
  'verification'?: CreateVerificationDto;

  constructor(data?: Partial<Document>) {
    Object.assign(
      this,
      omit(
        {
          ...data,
          id: data?._id.toString(),
        },
        ['_id', 'password']
      )
    );
  }
}
