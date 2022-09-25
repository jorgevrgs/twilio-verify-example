export class CreateUserVerification {
  'sid': string;
  'status': string;
  'createdAt': Date;
  'updatedAt': Date;

  constructor(data?: Partial<CreateUserVerification>) {
    Object.assign(this, data);
  }
}
