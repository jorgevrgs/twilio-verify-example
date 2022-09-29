import { Static, Type } from '@sinclair/typebox';
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

export type RegisterBody = Static<typeof registerSchema.body>;

export const loginSchema = {
  body: Type.Object({
    username: Type.String(),
    password: Type.String({ minLength: 6 }),
  }),
};

export type LoginBody = Static<typeof loginSchema.body>;
