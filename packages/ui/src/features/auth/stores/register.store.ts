import type { AxiosResponse } from 'axios';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { httpClient } from '../../../utils/http-client';
import {
  ErrorResponse,
  RegisterFormData,
  User,
  VerifyCodeFormData,
} from '../types';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = reactive<User>({
    id: '',
    username: '',
    phoneNumber: '',
    enableMFA: false,
    isPhoneNumberVerified: false,
    verification: {
      sid: '',
      status: '',
      createdAt: '',
      updatedAt: '',
    },
  });

  const isLoading = ref(false);
  const error = ref<string>();

  // Getters
  const sid = computed(() => user.verification.sid);
  const phoneNumber = computed(() => user.phoneNumber);
  const verificationStatus = computed(() => user.verification.status);
  const isAuthenticated = computed(() => {
    if (!user.id) {
      return false;
    }

    if (user.enableMFA && !user.isPhoneNumberVerified) {
      return false;
    }

    return true;
  });
  const nextStep = computed(() => {
    if (!user.id) {
      return 'register';
    }

    if (user.enableMFA && !user.isPhoneNumberVerified) {
      return 'verify';
    }

    return 'dashboard';
  });

  // Actions
  async function registerUser(formData: RegisterFormData) {
    isLoading.value = true;
    error.value = undefined;

    await httpClient
      .post<User, AxiosResponse<User, ErrorResponse>, RegisterFormData>(
        '/api/auth/register',
        formData
      )
      .then((res) => {
        Object.assign(user, res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      })
      .catch((err) => {
        error.value = err.response.data.message;
      })
      .finally(() => {
        isLoading.value = false;
      });
  }

  async function verifyCode(formData: VerifyCodeFormData) {
    isLoading.value = true;
    error.value = undefined;

    await httpClient
      .post<User, AxiosResponse<User, ErrorResponse>, VerifyCodeFormData>(
        '/api/auth/verify-code',
        formData
      )
      .then((res) => {
        Object.assign(user, res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      })
      .catch((err) => {
        error.value = err.response.data.message;
      })
      .finally(() => {
        isLoading.value = false;
      });
  }

  return {
    // state
    user,
    isLoading,
    error,

    // getters
    isAuthenticated,
    nextStep,
    sid,
    phoneNumber,
    verificationStatus,

    // actions
    registerUser,
    verifyCode,
  };
});
