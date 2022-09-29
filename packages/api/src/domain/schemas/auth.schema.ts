import { Type } from '@sinclair/typebox';
import { ChannelOptions } from '../constants';

export const registerSchema = {
  body: Type.Object({
    username: Type.String(),
    password: Type.String({ minLength: 6 }),
    phoneNumber: Type.String({ minLength: 10 }),
    enableMFA: Type.Boolean({ default: true }),
    channel: Type.Optional(
      Type.Enum(ChannelOptions, { default: ChannelOptions.sms })
    ),
  }),
};

export const loginSchema = {
  body: Type.Object({
    username: Type.String(),
    password: Type.String({ minLength: 6 }),
  }),
};
