import omit from 'lodash.omit';
import type { Document } from 'mongodb';
import { ChannelOptions } from '../constants';
import { CreateFactor } from './create-factor';
import { CreateVerificationDto } from './create-verification.dto';

/**
 * User information to be returned to the client
 */
export class UserDto {
  'defaultChannel': ChannelOptions = ChannelOptions.sms;
  'enableMFA': boolean;
  'factor'?: CreateFactor;
  'id': string;
  'phoneNumber': string;
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
