<template>
  <header class="flex justify-center gap-8">
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
import { computed, toRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../features/auth/stores/register.store';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isAuthenticated = toRef(authStore, 'isAuthenticated');

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
    isVisible: !isAuthenticated.value,
  },
  {
    name: 'Register',
    to: 'Register',
    isVisible: !isAuthenticated.value,
  },
  {
    name: 'Profile',
    to: 'Profile',
    isVisible: isAuthenticated.value,
  },
]);

const isActive = (name: string) => route.name === name;
</script>

<style scoped></style>
