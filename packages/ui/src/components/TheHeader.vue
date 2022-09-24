<template>
  <header class="flex justify-center gap-8">
    <RouterLink
      class="w-16 text-center py-2 hover:font-bold"
      :class="isActive(link.to) ? 'underline underline-offset-8' : ''"
      v-for="link in links"
      :key="link.to"
      :to="{ name: link.to }"
    >
      {{ link.name }}
    </RouterLink>
  </header>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../features/auth/stores/register.store';

const route = useRoute();
const authStore = useAuthStore();

const links = reactive<Array<{ name: string; to: string; isActive?: boolean }>>(
  [
    {
      name: 'Home',
      to: 'Home',
    },
  ]
);

if (authStore.isAuthenticated) {
  links.push({
    name: 'Profile',
    to: 'Profile',
  });
} else {
  links.push(
    {
      name: 'Login',
      to: 'Login',
    },
    {
      name: 'Register',
      to: 'Register',
    }
  );
}

const isActive = (name: string) => route.name === name;
</script>

<style scoped></style>
