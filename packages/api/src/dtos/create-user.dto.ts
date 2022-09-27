import { channel } from '../schemas/auth.schema';
import { CreateFactor } from './create-factor';

/**
 * User information to be stored in the database
 */
export class CreateUserDto {
  'defaultChannel': channel = channel.sms;
  'enableMFA': boolean;
  'factor'?: CreateFactor;
  'isPhoneNumberVerified': boolean = false;
  'password': string;
  'phoneNumber': string;
  'status': 'unconfirmed' | 'confirmed' = 'unconfirmed';
  'username': string;

  constructor(data?: Partial<CreateUserDto>) {
    Object.assign(this, data);
  }
}
