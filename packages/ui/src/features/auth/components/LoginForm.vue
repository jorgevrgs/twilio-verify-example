<script setup lang="ts">
import MazBtn from 'maz-ui/components/MazBtn';
import MazInput from 'maz-ui/components/MazInput';
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { AsyncActions, useAuthStore } from '../stores';
import { LoginFormData } from '../types';

const authStore = useAuthStore();
const router = useRouter();

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
const onSubmit = async () => {
  await authStore.dispatchAsyncForm(formData, AsyncActions.LOGIN);
  router.push({ name: 'Verification' });
};
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
      auto-focus
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
