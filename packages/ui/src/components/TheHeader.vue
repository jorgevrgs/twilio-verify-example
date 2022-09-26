<template>
  <header class="flex justify-center gap-8 mb-8 pb-2 border-b-2">
    <RouterLink
      class="w-16 text-center py-2 hover:font-bold"
      :class="{
        'underline underline-offset-8': isActive(link.to),
        hidden: !link.isVisible,
      }"
      v-for="link in links"
      :key="link.to"
      :to="{ name: link.to }"
    >
      {{ link.name }}
    </RouterLink>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../features/auth/stores';

const route = useRoute();
const authStore = useAuthStore();

const links = computed<
  Array<{ name: string; to: string; isVisible: boolean; isActive?: boolean }>
>(() => [
  {
    name: 'Home',
    to: 'Home',
    isVisible: true,
  },
  {
    name: 'Login',
    to: 'Login',
    isVisible: !authStore.isAuthenticated,
  },
  {
    name: 'Register',
    to: 'Register',
    isVisible: !authStore.isAuthenticated,
  },
  {
    name: 'Profile',
    to: 'Profile',
    isVisible: authStore.isAuthenticated,
  },
]);

const isActive = (name: string) => route.name === name;
</script>

<style scoped></style>
