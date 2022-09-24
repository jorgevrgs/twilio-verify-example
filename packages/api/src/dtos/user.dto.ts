import omit from 'lodash.omit';
import type { Document } from 'mongodb';

export class UserDto {
  'id': string;
  'username': string;
  'phoneNumber': string;
  'enableMFA': boolean;
  'isPhoneNumberVerified': boolean;
  'verification': {
    sid: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };

  constructor(data?: Partial<Document>) {
    Object.assign(
      this,
      omit(
        {
          ...data,
          id: data?._id.toString(),
        },
        ['_id', 'password']
      )
    );
  }
}
