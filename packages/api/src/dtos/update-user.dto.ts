import { CreateUserVerification } from './create-user-verification.dto';

export class UpdateUserDto {
  'verification'?: CreateUserVerification;

  constructor(data?: Partial<UpdateUserDto>) {
    Object.assign(this, data);
  }
}
