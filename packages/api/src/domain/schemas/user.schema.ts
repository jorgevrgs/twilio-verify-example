import { Static, Type } from '@sinclair/typebox';

export const changePassword = {
  body: Type.Object({
    currentPassword: Type.String({
      minLength: 6,
      examples: ['12345678'],
    }),
    newPassword: Type.String({
      minLength: 6,
      examples: ['a12345678'],
    }),
    confirmPassword: Type.String({
      minLength: 6,
      examples: ['a12345678'],
    }),
  }),
};

export type ChangePasswordBody = Static<typeof changePassword.body>;

export const userByUsernameSchema = {
  params: Type.Object({
    username: Type.String({
      minLength: 1,
      examples: ['john'],
    }),
  }),
};

export type UsernameParams = Static<typeof userByUsernameSchema.params>;
