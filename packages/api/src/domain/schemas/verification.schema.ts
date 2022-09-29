import { Static, Type } from '@sinclair/typebox';

const usernameSchema = Type.Object({
  username: Type.String({
    description: 'The username of the user to create a verification for',
    examples: ['john'],
  }),
});

export const createVerificationSchema = {
  title: 'Create Verification',
  description: 'Create a verification code to be sent to the user',
  params: usernameSchema,
  body: Type.Object({
    phoneNumber: Type.Optional(
      Type.String({
        description: 'The phone number to send the verification to',
      })
    ),
    channel: Type.Optional(
      Type.String({
        description: 'The channel to send the verification to',
      })
    ),
  }),
};

export const verifyCodeSchema = {
  params: usernameSchema,
  body: Type.Object({
    verificationCode: Type.String({
      minLength: 4,
      maxLength: 10,
      examples: ['123456'],
    }),
    phoneNumber: Type.Optional(
      Type.String({
        examples: ['+573214567890'],
      })
    ),
    sid: Type.Optional(Type.String()),
  }),
};

export type CreateVerificationParams = Static<
  typeof createVerificationSchema.params
>;

export type CreateVerificationBody = Static<
  typeof createVerificationSchema.body
>;

export type VerifyCodeParams = Static<typeof verifyCodeSchema.params>;

export type VerifyCodeBody = Static<typeof verifyCodeSchema.body>;
