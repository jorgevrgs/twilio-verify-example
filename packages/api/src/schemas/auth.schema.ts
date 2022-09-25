import { Type } from '@sinclair/typebox';

export const registerSchema = {
  body: Type.Object({
    username: Type.String(),
    password: Type.String({ minLength: 6 }),
    phoneNumber: Type.String({ minLength: 10 }),
    enableMFA: Type.Boolean({ default: true }),
  }),
};

export const loginSchema = {
  body: Type.Object({
    username: Type.String(),
    password: Type.String({ minLength: 6 }),
  }),
};

export const verifyCodeSchema = {
  body: Type.Object({
    verificationCode: Type.String({
      minLength: 4,
      maxLength: 10,
      examples: ['123456'],
    }),
    phoneNumber: Type.String({
      minLength: 10,
      examples: ['+573214567890'],
    }),
    sid: Type.String(),
  }),
};
