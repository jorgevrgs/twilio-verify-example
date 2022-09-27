<template>
  <section class="flex flex-col">
    <h1>Verification</h1>

    <VerificationCheck v-if="authStore.verification" />
    <div v-else class="flex justify-center items-center">
      <BounceLoader />
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BounceLoader from 'vue-spinner/src/BounceLoader.vue';
import VerificationCheck from '../features/auth/components/VerificationCheck.vue';
import { useAuthStore } from '../features/auth/stores';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  console.log('Running onMounted', authStore.verificationState);

  if (!authStore.action || !authStore.formData) {
    return;
  }

  if (authStore.verificationState === 'pending') {
    await authStore.createCode();
  }
});

watchEffect(async () => {
  console.log('Running watchEffect', authStore.verificationState);

  if (authStore.verificationState === 'success') {
    await authStore.executeAsyncForm();

    authStore.cleanAsyncForm();
    authStore.cleanMessages();

    router.push((route.query.redirect as string) || { name: 'Profile' });
  }
});
</script>

<style scoped></style>
