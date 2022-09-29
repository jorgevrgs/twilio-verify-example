import { Document } from 'mongodb';
import { ChannelOptions } from '../constants';

export class UserSchemaDto implements Document {
  'defaultChannel': ChannelOptions = ChannelOptions.sms;
  'enableMFA': boolean;
  'password': string;
  'phoneNumber': string;
  'username': string;
}
