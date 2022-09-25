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
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../features/auth/stores/register.store';

const route = useRoute();
const authStore = useAuthStore();

const links = computed(() => {
  const result = [
    {
      name: 'Home',
      to: 'Home',
    },
  ];

  if (authStore.isAuthenticated) {
    result.push({
      name: 'Profile',
      to: 'Profile',
    });
  } else {
    result.push(
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

  return result;
});

const isActive = (name: string) => route.name === name;
</script>

<style scoped></style>
