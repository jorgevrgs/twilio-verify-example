import { defineStore } from 'pinia';
import { httpClient } from '../../../utils/http-client';
import { FormData, User } from '../types';

export interface RegisterStore {
  user?: User;
  isLoading: boolean;
  error?: string;
}

export const useRegisterStore = defineStore('register', {
  state: (): RegisterStore => ({
    user: undefined,
    isLoading: true,
    error: undefined,
  }),
  getters: {
    isAuthenticated(): boolean {
      return Boolean(this.user);
    },
    nextStep(): string {
      if (this.user?.isMfaEnabled && !this.user?.isPhoneNumberVerified) {
        return 'verify-mfa';
      }

      return 'profile';
    },
  },
  actions: {
    registerUser(formData: FormData) {
      httpClient
        .post<User>('/api/v1/auth/register', formData)
        .then((res) => {
          this.user = res.data;
        })
        .catch((err) => {
          this.error = err.message;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
});