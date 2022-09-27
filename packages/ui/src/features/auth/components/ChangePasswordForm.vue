<script setup lang="ts">
import MazBtn from 'maz-ui/components/MazBtn';
import MazInput from 'maz-ui/components/MazInput';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AsyncActions, useAuthStore } from '../stores';
import { ChangePasswordFormData } from '../types';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const defaultFormData: ChangePasswordFormData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const formData = reactive<ChangePasswordFormData>(defaultFormData);

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
const onSubmit = async () => {
  await authStore.dispatchAsyncForm(formData, AsyncActions.CHANGE_PASSWORD);
  router.push({ name: 'Verification' });
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
      type="text"
      class="hidden"
      name="username"
      id="username"
      :value="username"
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
