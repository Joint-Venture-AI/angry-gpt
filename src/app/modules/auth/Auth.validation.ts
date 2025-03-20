import { z } from 'zod';

export const AuthValidations = {
  passwordChangeValidationSchema: z.object({
    body: z.object({
      oldPassword: z
        .string()
        .min(1, 'Old Password is required')
        .min(6, 'Old Password must be at least 6 characters long'),
      newPassword: z
        .string()
        .min(1, 'New Password is required')
        .min(6, 'New Password must be at least 6 characters long'),
    }),
  }),

  refreshTokenValidationSchema: z.object({
    cookies: z.object({
      refreshToken: z.string({
        required_error: 'refreshToken is missing',
      }),
    }),
  }),

  loginWithValidationSchema: z.object({
    params: z.object({
      provider: z.enum(['facebook', 'google', 'apple'], {
        errorMap: () => ({
          message: 'Provider must be one of facebook, google, or apple',
        }),
      }),
    }),
  }),
};
