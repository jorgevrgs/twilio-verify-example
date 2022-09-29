import { ChannelOptions } from '../constants';

/**
 * User information to be stored in the database
 */
export class CreateUserDto {
  'defaultChannel': ChannelOptions = ChannelOptions.sms;
  'enableMFA': boolean;
  'password': string;
  'phoneNumber': string;
  'username': string;

  constructor(data?: Partial<CreateUserDto>) {
    Object.assign(this, data);
  }
}
