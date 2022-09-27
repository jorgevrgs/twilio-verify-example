export class UpdateUserDto {
  'password'?: string;

  constructor(data?: Partial<UpdateUserDto>) {
    Object.assign(this, data);
  }
}
