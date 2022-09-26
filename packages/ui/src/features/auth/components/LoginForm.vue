<script setup lang="ts">
import { ToasterHandler } from 'maz-ui';
import MazBtn from 'maz-ui/components/MazBtn';
import MazInput from 'maz-ui/components/MazInput';
import { computed, inject, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores';
import { LoginFormData } from '../types';

const router = useRouter();
const authStore = useAuthStore();
const toast = inject<ToasterHandler>('toast');

const defaultFormData: LoginFormData = {
  username: '',
  password: '',
};
const formData = reactive<LoginFormData>(defaultFormData);

// Computed
const isValidForm = computed(() => {
  return Boolean(formData.username) && Boolean(formData.password);
});

// Methods
const onSubmit = async (e: Event) => {
  console.log('onSubmit');

  e.preventDefault();

  await authStore.logInUser(formData);

  if (authStore.error) {
    toast?.warning(
      'Please try again, log in instead, or contact our customer support team if the problem persists.'
    );
    toast?.error(authStore.error);
  } else {
    if (authStore.user?.enableMFA) {
      toast?.success(
        'Redirecting to verification page... Please wait a few seconds while you receive the verification code.'
      );
    } else {
      toast?.success('User signed in successfully!');
    }

    router.push({ name: 'Profile' });
  }

  // Reset forms
  Object.assign(formData, defaultFormData);
};

// Lifecycle
onMounted(() => {
  if (authStore.isPhoneVerificationInProgress) {
    router.push({ name: 'Verification' });
  }
});
</script>

<template>
  <form class="flex flex-col gap-4 mt-8">
    <MazInput
      type="text"
      id="username"
      label="Username"
      v-model="formData.username"
      aria-label="Username"
      autocomplete="username"
      required
    />

    <MazInput
      type="password"
      v-model="formData.password"
      id="password"
      label="Password"
      aria-label="Password"
      autocomplete="current-password"
      required
    />

    <div class="flex justify-end">
      <MazBtn
        @click.prevent="onSubmit"
        type="submit"
        color="primary"
        :disabled="!isValidForm"
        :loading="authStore.isLoading"
        >Submit</MazBtn
      >
    </div>
  </form>
</template>
