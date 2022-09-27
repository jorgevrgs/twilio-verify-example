import { CreateFactor } from './create-factor';
import { CreateVerificationDto } from './create-verification.dto';

export class UpdateUserDto {
  'verification'?: CreateVerificationDto;
  'factor'?: CreateFactor;

  constructor(data?: Partial<UpdateUserDto>) {
    Object.assign(this, data);
  }
}
