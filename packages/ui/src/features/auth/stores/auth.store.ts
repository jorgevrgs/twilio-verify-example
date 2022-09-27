import type { AxiosResponse } from 'axios';
import { defineStore } from 'pinia';
import { httpClient } from '../../../utils/http-client';
import {
  ChangePasswordFormData,
  CreateCodeForm,
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
  action?: AsyncActions;
  /**
   * @description The error message to show to the user
   */
  error?: string;

  factor?: Factor;

  formData?: F;

  isLoading: boolean;

  isVerificationRequired: boolean;

  /**
   * @description The success me
   */
  success?: string;

  /**
   * @description The user object
   */
  user?: UserState;

  /**
   * @description The verification object returned from the API
   */

  verification?: Verification;

  /**
   * @description Handle the verification state during the request process
   */
  verificationState: 'idle' | 'pending' | 'success' | 'error';
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState<AsyncFormData> => ({
    action: undefined,
    error: undefined,
    factor: undefined,
    formData: undefined,
    isLoading: false,
    isVerificationRequired: false,
    success: undefined,
    user: undefined,
    verification: undefined,
    verificationState: 'idle',
  }),

  getters: {
    isAuthenticated: ({ user }) => user?.id !== undefined,
    isVerified: ({ verification }) => Boolean(verification?.valid),
    currentUsername: ({ formData, user }) => {
      if (formData && 'username' in formData && formData?.username) {
        return formData.username;
      }

      if (user?.username) {
        return user.username;
      }

      return undefined;
    },
    currentChannel: ({ formData, user }) => {
      if (formData && 'channel' in formData && formData?.channel) {
        return formData.channel;
      }

      if (user?.defaultChannel) {
        return user.defaultChannel;
      }

      return undefined;
    },
    currentPhoneNumber: ({ formData, user }) => {
      if (formData && 'phoneNumber' in formData && formData?.phoneNumber) {
        return formData.phoneNumber;
      }

      if (user?.phoneNumber) {
        return user.phoneNumber;
      }

      return undefined;
    },
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

    async dispatchAsyncForm(formData: AsyncFormData, action: AsyncActions) {
      this.isLoading = true;
      this.error = undefined;
      this.verification = undefined;
      this.formData = formData;
      this.action = action;

      await this.checkVerification();

      this.isLoading = false;
    },

    async checkVerification() {
      switch (this.action) {
        case AsyncActions.REGISTER:
          const registerformData = this.formData as RegisterFormData;

          this.verificationState = registerformData.enableMFA
            ? 'pending'
            : 'success';
          this.isVerificationRequired = registerformData.enableMFA;
          break;
        case AsyncActions.LOGIN:
          const loginformData = this.formData as LoginFormData;
          const username = loginformData.username;
          const isMFAEnabled = await httpClient
            .get<Pick<UserResponse, 'id' | 'enableMFA'>>(
              `/api/users/${encodeURIComponent(username)}`
            )
            .then(({ data }) => data.enableMFA)
            .catch(() => {
              this.error = 'Username or password is incorrect';
              return false;
            });

          this.verificationState = isMFAEnabled ? 'pending' : 'success';
          this.isVerificationRequired = isMFAEnabled;
          break;
        case AsyncActions.CHANGE_PASSWORD:
          this.verificationState = this.user?.enableMFA ? 'pending' : 'success';
          this.isVerificationRequired = Boolean(this.user?.enableMFA);
          break;
      }
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
        .catch((_err) => {
          // Ignore error;
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

      let formData = {
        phoneNumber: this.currentPhoneNumber,
        channel: this.currentChannel,
      } as CreateCodeForm;

      await httpClient
        .post<
          Verification,
          AxiosResponse<Verification, ErrorResponse>,
          CreateCodeForm
        >(`/api/verification/create/${this.currentUsername}`, formData)
        .then(({ data }) => {
          this.verification = data;
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
        >(`/api/verification/verify/${this.currentUsername}`, formData)
        .then((res) => {
          this.verificationState = 'success';
          this.verification = res.data;
          if (this.user) {
            this.$patch({
              user: this.user,
            });
          }
        })
        .catch((err) => {
          this.verificationState = 'error';
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
