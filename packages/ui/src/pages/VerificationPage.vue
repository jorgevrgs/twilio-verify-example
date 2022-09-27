<template>
  <section class="flex flex-col">
    <h1>Verification</h1>

    <VerificationCheck v-if="authStore.verification" />
    <div v-else class="text-center">Creating code...</div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import VerificationCheck from '../features/auth/components/VerificationCheck.vue';
import { useAuthStore } from '../features/auth/stores';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

onMounted(async () => {
  if (!authStore.verification && authStore.isVerificationRequired) {
    await authStore.createCode();
  } else {
    router.push((route.query.redirect as string) || { name: 'Profile' });
  }
});
</script>

<style scoped></style>
