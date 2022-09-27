import type { AxiosResponse } from 'axios';
import { defineStore } from 'pinia';
import { httpClient } from '../../../utils/http-client';
import {
  ErrorResponse,
  LoginFormData,
  RegisterFormData,
  User,
  Verification,
  VerifyCodeFormData,
} from '../types';

export interface AuthState {
  user?: User;
  verification?: Verification;
  isLoading: boolean;
  error?: string;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    error: undefined,
    isLoading: false,
    user: undefined,
    verification: undefined,
  }),

  getters: {
    /**
     * Determine if the user should be redirected to the verification page
     */
    isPhoneVerificationRequired: ({ user }) => {
      return Boolean(user?.enableMFA) && Boolean(!user?.isPhoneNumberVerified);
    },

    isPhoneVerificationInProgress: ({ user, verification }) => {
      return verification?.status === 'pending';
    },

    /**
     * Determine if the verification code is required in the verification page
     */
    isVerificationRequired: ({ user, verification }) => {
      return Boolean(
        user?.enableMFA && (!verification || verification?.status === 'pending')
      );
    },

    /**
     * Determine if the user continues to login page, verification page or profile page
     */
    isAuthenticated: ({ user }) => user?.id !== undefined,
  },

  actions: {
    async registerUser(formData: RegisterFormData) {
      this.isLoading = true;
      this.error = undefined;

      await httpClient
        .post<User, AxiosResponse<User, ErrorResponse>, RegisterFormData>(
          '/api/auth/register',
          formData
        )
        .then((res) => {
          this.user = res.data;
          localStorage.setItem('user', JSON.stringify(res.data));
        })
        .catch((err) => {
          this.error = err.response.data.message;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    async createCode() {
      this.isLoading = true;
      this.error = undefined;

      await httpClient
        .post<
          Verification,
          AxiosResponse<Verification, ErrorResponse>,
          undefined
        >('/api/verification/create')
        .then((res) => {
          this.verification = res.data;
          localStorage.setItem('user', JSON.stringify(res.data));
        })
        .catch((err) => {
          this.error = err.response.data.message;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    async verifyCode(formData: VerifyCodeFormData) {
      this.isLoading = true;
      this.error = undefined;

      await httpClient
        .post<
          Verification,
          AxiosResponse<Verification, ErrorResponse>,
          VerifyCodeFormData
        >('/api/verification/verify', formData)
        .then((res) => {
          this.verification = res.data;
          if (this.user) {
            this.user.isPhoneNumberVerified = true;
          }
        })
        .catch((err) => {
          this.error = err.response.data.message;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    async logInUser(formData: LoginFormData) {
      this.isLoading = true;
      this.error = undefined;

      await httpClient
        .post<User, AxiosResponse<User, ErrorResponse>>(
          '/api/auth/login',
          formData
        )
        .then((res) => {
          this.user = res.data;
        })
        .catch((err) => {
          this.error = err.response.data.message;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    async logout() {
      this.isLoading = true;
      await httpClient
        .post<null, AxiosResponse<null, ErrorResponse>, null>(
          '/api/auth/logout'
        )
        .catch((err) => {
          this.error = err.response.data.message;
        })
        .finally(() => {
          this.isLoading = false;
          this.$reset();
        });
    },
  },
});
