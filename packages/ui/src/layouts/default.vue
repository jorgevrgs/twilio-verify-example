<template>
  <div class="flex w-full h-screen bg-gray-300 md:p-8">
    <div
      class="w-full min-h-full bg-white md:max-w-xl md:mx-auto p-8 rounded-md"
    >
      <TheHeader />
      <TheBody />
      <TheFooter />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ToasterHandler } from 'maz-ui';
import { inject, watchEffect } from 'vue';
import TheBody from '../components/TheBody.vue';
import TheFooter from '../components/TheFooter.vue';
import TheHeader from '../components/TheHeader.vue';
import { useAuthStore } from '../features/auth/stores';

const toast = inject<ToasterHandler>('toast');
const authStore = useAuthStore();

watchEffect(() => {
  if (authStore.error) {
    toast?.error(authStore.error);
  } else if (authStore.success) {
    toast?.success(authStore.success);
  }

  authStore.cleanMessages();
});
</script>

<style scoped></style>
