export class UpdateUserDto {
  'password'?: string;
  'isPhoneNumberVerified'?: boolean;

  constructor(data?: Partial<UpdateUserDto>) {
    Object.assign(this, data);
  }
}
