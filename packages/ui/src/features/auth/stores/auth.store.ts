import type { AxiosResponse } from 'axios';
import { defineStore } from 'pinia';
import { httpClient } from '../../../utils/http-client';
import {
  ErrorResponse,
  LoginFormData,
  RegisterFormData,
  User,
  VerifyCodeFormData,
} from '../types';

export interface AuthState {
  user?: User;
  isLoading: boolean;
  error?: string;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: undefined,
    isLoading: false,
    error: undefined,
  }),

  getters: {
    /**
     * Determine if the user should be redirected to the verification page
     */
    isPhoneVerificationRequired: ({ user }) => {
      return Boolean(user?.enableMFA) && Boolean(!user?.isPhoneNumberVerified);
    },

    isPhoneVerificationInProgress: ({ user }) => {
      return user?.verification?.status === 'pending';
    },

    /**
     * Determine if the verification code is required in the verification page
     */
    isVerificationRequired: ({ user }) => {
      return (
        Boolean(user?.enableMFA) && user?.verification?.status === 'pending'
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

    async verifyCode(formData: VerifyCodeFormData) {
      this.isLoading = true;
      this.error = undefined;

      await httpClient
        .post<User, AxiosResponse<User, ErrorResponse>, VerifyCodeFormData>(
          '/api/auth/verify-code',
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
          localStorage.setItem('user', JSON.stringify(res.data));
        })
        .catch((err) => {
          this.error = err.response.data.message;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    async logout() {
      await httpClient
        .post<null, AxiosResponse<null, ErrorResponse>, null>(
          '/api/auth/logout'
        )
        .catch((err) => {
          this.error = err.response.data.message;
        })
        .finally(() => {
          localStorage.removeItem('user');
        });
    },
  },
});
