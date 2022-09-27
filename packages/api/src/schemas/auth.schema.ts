import { Type } from '@sinclair/typebox';

export enum channel {
  sms = 'sms',
  call = 'call',
}

export const registerSchema = {
  body: Type.Object({
    username: Type.String(),
    password: Type.String({ minLength: 6 }),
    phoneNumber: Type.String({ minLength: 10 }),
    enableMFA: Type.Boolean({ default: true }),
    channel: Type.Optional(Type.Enum(channel, { default: channel.sms })),
  }),
};

export const loginSchema = {
  body: Type.Object({
    username: Type.String(),
    password: Type.String({ minLength: 6 }),
  }),
};
