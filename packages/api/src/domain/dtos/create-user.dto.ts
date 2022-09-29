import omit from 'lodash.omit';
import { ChannelOptions } from '../constants';
import { RegisterBody } from '../schemas';

/**
 * User information to be stored in the database
 */
export class CreateUserDto {
  'defaultChannel': ChannelOptions;
  'enableMFA': boolean;
  'password': string;
  'phoneNumber': string;
  'username': string;

  constructor(data?: Partial<RegisterBody>) {
    Object.assign(this, {
      ...omit(data, ['channel']),
      defaultChannel: data?.channel || ChannelOptions.sms,
    });
  }
}
