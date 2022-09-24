import type { AxiosResponse } from 'axios';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { httpClient } from '../../../utils/http-client';
import { ErrorResponse, FormData, User } from '../types';

export const useAuthStore = defineStore('auth', () => {
  const user = reactive<User>({
    id: '',
    username: '',
    phoneNumber: '',
    enableMFA: false,
    isPhoneNumberVerified: false,
    verification: {
      sid: '',
      status: '',
    },
  });

  const isLoading = ref(false);
  const error = ref<string>();

  const isAuthenticated = computed(() => !!user.id);
  const nextStep = computed(() => {
    if (!user.id) {
      return 'register';
    }

    if (user.enableMFA && !user.isPhoneNumberVerified) {
      return 'verify';
    }

    return 'dashboard';
  });

  async function registerUser(formData: FormData) {
    isLoading.value = true;
    error.value = undefined;

    await httpClient
      .post<User, AxiosResponse<User, ErrorResponse>, FormData>(
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

  return {
    // state
    user,
    isLoading,
    error,

    // getters
    isAuthenticated,
    nextStep,

    // actions
    registerUser,
  };
});
