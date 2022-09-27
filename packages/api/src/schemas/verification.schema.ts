import { Static, Type } from '@sinclair/typebox';

export const createVerificationSchema = {
  title: 'Create Verification',
  description: 'Create a verification code to be sent to the user',
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

export type VerifyCodeBody = Static<typeof verifyCodeSchema.body>;
