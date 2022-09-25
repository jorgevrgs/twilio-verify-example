<script setup lang="ts">
import { ToasterHandler, ToasterOptions } from 'maz-ui';
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

  const toastOptions: ToasterOptions = {
    position: 'bottom',
    timeout: 10_000,
    persistent: false,
  };

  if (authStore.error) {
    toast?.info(
      'Please try again, log in instead, or contact our customer support team if the problem persists.',
      toastOptions
    );
    toast?.error(authStore.error, toastOptions);
  } else {
    if (!authStore.isVerificationRequired) {
      toast?.success(
        'Check your mobile phone and fill out the form below with the code',
        toastOptions
      );
    } else {
      toast?.success('User registered successfully!', toastOptions);
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
      autocomplete="new-password"
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
