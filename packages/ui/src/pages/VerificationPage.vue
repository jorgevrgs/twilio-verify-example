<template>
  <section class="flex flex-col">
    <h1>Verification</h1>

    <VerificationCheck v-if="authStore.verification" />
    <div v-else class="text-center">Creating code...</div>
  </section>
</template>

<script setup lang="ts">
import { ToasterHandler } from 'maz-ui';
import { inject, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import VerificationCheck from '../features/auth/components/VerificationCheck.vue';
import { useAuthStore } from '../features/auth/stores';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const toast = inject<ToasterHandler>('toast');

const exec = async (state: string) => {
  switch (state) {
    case 'pending':
      await authStore.createCode();
      break;
    case 'success':
    default:
      await authStore.executeAsyncForm();

      if (authStore.success) toast?.success(authStore.success);
      if (authStore.error) toast?.error(authStore.error);

      router.push((route.query.redirect as string) || { name: 'Profile' });
  }
};

watch(
  () => authStore.verificationState,
  async (state) => {
    console.log('Running watch', state);

    exec(state);
  }
);

onMounted(async () => {
  console.log('Running onMounted', authStore.verificationState);

  if (!authStore.action || !authStore.formData) {
    return;
  }

  exec(authStore.verificationState);
});
</script>

<style scoped></style>
