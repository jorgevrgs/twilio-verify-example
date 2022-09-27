import { channel } from '../schemas/auth.schema';

/**
 * User information to be stored in the database
 */
export class CreateUserDto {
  'defaultChannel': channel = channel.sms;
  'enableMFA': boolean;
  'password': string;
  'phoneNumber': string;
  'username': string;

  constructor(data?: Partial<CreateUserDto>) {
    Object.assign(this, data);
  }
}
