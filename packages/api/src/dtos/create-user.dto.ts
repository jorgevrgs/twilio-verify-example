import { channel } from '../schemas/auth.schema';

/**
 * User information to be stored in the database
 */
export class CreateUserDto {
  'defaultChannel': channel = channel.sms;
  'enableMFA': boolean;
  'isPhoneNumberVerified': boolean = false;
  'password': string;
  'phoneNumber': string;
  'status': 'unconfirmed' | 'confirmed' = 'unconfirmed';
  'username': string;

  constructor(data?: Partial<CreateUserDto>) {
    Object.assign(this, data);
  }
}
