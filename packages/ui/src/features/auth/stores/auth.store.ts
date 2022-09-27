import type { AxiosResponse } from 'axios';
import { defineStore } from 'pinia';
import { httpClient } from '../../../utils/http-client';
import {
  ErrorResponse,
  Factor,
  LoginFormData,
  RegisterFormData,
  UserResponse,
  UserState,
  Verification,
  VerifyCodeFormData,
} from '../types';

export interface AuthState {
  user?: UserState;
  verification?: Verification;
  factor?: Factor;
  isLoading: boolean;
  error?: string;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    error: undefined,
    factor: undefined,
    isLoading: false,
    user: undefined,
    verification: undefined,
  }),

  getters: {
    /**
     * Determine if the verification should display the code input
     */
    isPhoneVerificationInProgress: ({ verification }) => {
      return verification?.status === 'pending';
    },

    /**
     * Determine if the verification code is required in the verification page
     */
    isVerificationRequired: ({ user, verification }) => {
      return (
        Boolean(user?.enableMFA) &&
        (!verification || verification?.status === 'pending')
      );
    },

    /**
     * Determine if the user continues to login page, verification page or profile page
     */
    isAuthenticated: ({ user }) => user?.id !== undefined,
  },

  actions: {
    async getCurrentUser() {
      this.isLoading = true;
      await httpClient
        .get<UserResponse, AxiosResponse<UserResponse, ErrorResponse>>(
          '/api/users/me'
        )
        .then(({ data }) => {
          const { verification, factor, ...user } = data;

          this.user = user;
          this.verification = verification;
          this.factor = factor;
        })
        .catch((err) => {
          this.error = err.response.data.message;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async registerUser(formData: RegisterFormData) {
      this.isLoading = true;
      this.error = undefined;

      await httpClient
        .post<
          UserState,
          AxiosResponse<UserState, ErrorResponse>,
          RegisterFormData
        >('/api/auth/register', formData)
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
            this.$patch({
              user: {
                ...this.user,
                isPhoneNumberVerified: true,
              },
            });
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
        .post<UserState, AxiosResponse<UserState, ErrorResponse>>(
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
