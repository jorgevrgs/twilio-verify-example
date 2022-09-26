import omit from 'lodash.omit';
import type { Document } from 'mongodb';
import { channel } from '../schemas/auth.schema';
import { CreateUserVerification } from './create-user-verification.dto';

export class UserDto {
  'id': string;
  'username': string;
  'phoneNumber': string;
  'enableMFA': boolean;
  'isPhoneNumberVerified': boolean;
  'verification'?: CreateUserVerification;
  'defaultChannel': channel = channel.sms;

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
