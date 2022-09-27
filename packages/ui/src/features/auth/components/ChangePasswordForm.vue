<script setup lang="ts">
import { ToasterHandler } from 'maz-ui';
import MazBtn from 'maz-ui/components/MazBtn';
import MazInput from 'maz-ui/components/MazInput';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores';

const router = useRouter();
const authStore = useAuthStore();
const toast = inject<ToasterHandler>('toast');

const username = ref('');
const defaultFormData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const formData = reactive(defaultFormData);

// Computed
const isValidForm = computed(() => {
  return (
    Boolean(formData.currentPassword) &&
    Boolean(formData.newPassword) &&
    Boolean(formData.confirmPassword) &&
    formData.newPassword === formData.confirmPassword
  );
});
const arePasswordsValid = computed(() => {
  return (
    formData.newPassword.length >= 6 &&
    formData.newPassword === formData.confirmPassword
  );
});

// Methods
const onSubmit = async (e: Event) => {
  console.log('onSubmit');

  e.preventDefault();

  // await authStore.changePassword(formData);

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
  if (authStore.user) {
    username.value = authStore.user.username;
  }
});
</script>

<template>
  <form class="flex flex-col gap-4 mt-8">
    <input
      type="hidden"
      name="username"
      id="username"
      v-model="username"
      autocomplete="username"
    />

    <MazInput
      type="password"
      v-model="formData.currentPassword"
      id="current-password"
      label="Current Password"
      aria-label="Current Password"
      autocomplete="current-password"
      required
      auto-focus
    />

    <hr class="border-gray-200 dark:border-gray-700 my-8" />

    <MazInput
      type="password"
      v-model="formData.newPassword"
      id="new-password"
      label="New Password"
      aria-label="New Password"
      autocomplete="current-password"
      :valid-button="arePasswordsValid"
      required
    />

    <MazInput
      type="password"
      v-model="formData.confirmPassword"
      id="confirm-password"
      label="Confirm Password"
      aria-label="Confirm Password"
      autocomplete="confirm-password"
      :valid-button="arePasswordsValid"
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
