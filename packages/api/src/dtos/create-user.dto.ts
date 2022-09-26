import { channel } from '../schemas/auth.schema';
import { CreateUserVerification } from './create-user-verification.dto';

export class CreateUserDto {
  'username': string;
  'password': string;
  'phoneNumber': string;
  'enableMFA': boolean;
  'isPhoneNumberVerified': boolean;
  'verification'?: CreateUserVerification;
  'defaultChannel': channel = channel.sms;

  constructor(data?: Partial<CreateUserDto>) {
    Object.assign(this, data);
  }
}
