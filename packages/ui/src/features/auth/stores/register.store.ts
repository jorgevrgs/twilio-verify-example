import type { AxiosResponse } from 'axios';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { httpClient } from '../../../utils/http-client';
import {
  ErrorResponse,
  LoginFormData,
  RegisterFormData,
  User,
  VerifyCodeFormData,
} from '../types';

export const useAuthStore = defineStore('auth', function () {
  // State
  let defaultUser: User = {
    id: '',
    username: '',
    phoneNumber: '',
    enableMFA: false,
    isPhoneNumberVerified: false,
  };
  const user = reactive<User>(defaultUser);

  const isLoading = ref(false);
  const error = ref<string>();

  // Getters
  const sid = computed(() => user.verification?.sid);
  const phoneNumber = computed(() => user.phoneNumber);
  const verificationStatus = computed(() => user.verification?.status);
  const isVerificationRequired = computed(
    () => user.enableMFA && user.verification?.status === 'pending'
  );
  const isAuthenticated = computed(() => {
    if (
      !user.id ||
      (user.id && user.enableMFA && !user.isPhoneNumberVerified)
    ) {
      return false;
    }

    return true;
  });
  const nextStep = computed<'authenticate' | 'verify' | 'profile'>(() => {
    if (!user.id) {
      return 'authenticate';
    }

    if (user.enableMFA && !user.isPhoneNumberVerified) {
      return 'verify';
    }

    return 'profile';
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

  async function logInUser(formData: LoginFormData) {
    isLoading.value = true;
    error.value = undefined;

    await httpClient
      .post<User, AxiosResponse<User, ErrorResponse>>(
        '/api/auth/login',
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

  async function logout() {
    await httpClient
      .post<null, AxiosResponse<null, ErrorResponse>, null>('/api/auth/logout')
      .catch((err) => {
        error.value = err.response.data.message;
      })
      .finally(() => {
        localStorage.removeItem('user');
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
    isVerificationRequired,

    // actions
    registerUser,
    verifyCode,
    logInUser,
    logout,
  };
});
