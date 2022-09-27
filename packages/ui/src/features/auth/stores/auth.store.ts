import type { AxiosResponse } from 'axios';
import { defineStore } from 'pinia';
import { httpClient } from '../../../utils/http-client';
import {
  ChangePasswordFormData,
  ErrorResponse,
  Factor,
  LoginFormData,
  RegisterFormData,
  UserResponse,
  UserState,
  Verification,
  VerifyCodeFormData,
} from '../types';

export enum AsyncActions {
  'REGISTER' = 'registerUser',
  'LOGIN' = 'login',
  'CHANGE_PASSWORD' = 'changePassword',
}

export type AsyncFormData =
  | ChangePasswordFormData
  | LoginFormData
  | RegisterFormData;

export interface AuthState<F> {
  user?: UserState;
  verification?: Verification;
  factor?: Factor;
  isLoading: boolean;
  error?: string;
  success?: string;
  formData?: F;
  action?: AsyncActions;
  verificationState: 'idle' | 'pending' | 'success' | 'error';
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState<AsyncFormData> => ({
    error: undefined,
    success: undefined,
    factor: undefined,
    isLoading: false,
    user: undefined,
    verification: undefined,
    formData: undefined,
    action: undefined,
    verificationState: 'idle',
  }),

  getters: {
    isAuthenticated: ({ user }) => user?.id !== undefined,

    isVerified: ({ verification }) => verification?.valid,
  },

  actions: {
    cleanMessages() {
      this.error = undefined;
      this.success = undefined;
    },

    cleanAsyncForm() {
      this.formData = undefined;
      this.action = undefined;
    },

    async checkVerification() {
      switch (this.action) {
        case AsyncActions.REGISTER:
          this.verificationState =
            this.formData &&
            'enableMFA' in this.formData &&
            this.formData.enableMFA
              ? 'pending'
              : 'success';
          break;
        case AsyncActions.LOGIN:
          const username =
            this.formData && 'username' in this.formData
              ? this.formData.username
              : '';
          const isMFAEnabled = await httpClient
            .get<Pick<UserResponse, 'id' | 'enableMFA'>>(
              `/api/users/${encodeURIComponent(username)}`
            )
            .then(({ data }) => data.enableMFA);
          this.verificationState = isMFAEnabled ? 'pending' : 'success';
          break;
        case AsyncActions.CHANGE_PASSWORD:
          this.verificationState = this.user?.enableMFA ? 'pending' : 'success';
          break;
      }
    },

    async dispatchAsyncForm(formData: AsyncFormData, action: AsyncActions) {
      this.isLoading = true;
      this.error = undefined;
      this.verification = undefined;
      this.formData = formData;
      this.action = action;

      await this.checkVerification();

      this.isLoading = false;
    },

    async executeAsyncForm() {
      if (!this.formData || !this.action) {
        return;
      }

      this.isLoading = true;
      this.error = undefined;

      let successMessage = '';
      let errorMessage = '';
      let promise: Promise<void>;

      switch (this.action) {
        case AsyncActions.LOGIN:
          promise = this.logInUser(this.formData as LoginFormData);
          successMessage = 'Login successful';
          errorMessage = 'Login failed';
          break;
        case AsyncActions.REGISTER:
          promise = this.registerUser(this.formData as RegisterFormData);
          successMessage = 'Registration successful';
          errorMessage = 'Registration failed';
          break;
        case AsyncActions.CHANGE_PASSWORD:
          promise = this.changePassword(
            this.formData as ChangePasswordFormData
          );
          successMessage = 'Password changed successfully';
          errorMessage = 'Password change failed';
          break;
        default:
          throw new Error('Invalid action');
      }

      try {
        await promise;
        this.error = undefined;
        this.formData = undefined;
        this.action = undefined;
        this.success = successMessage;
      } catch (error) {
        this.error = errorMessage;
      } finally {
        this.isLoading = false;
      }
    },

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
              user: this.user,
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

    async changePassword(formData: ChangePasswordFormData) {
      this.isLoading = true;
      this.error = undefined;

      await httpClient
        .patch<
          null,
          AxiosResponse<null, ErrorResponse>,
          ChangePasswordFormData
        >('/api/users/change-password', formData)
        .catch((err) => {
          this.error = err.response.data.message;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
});
