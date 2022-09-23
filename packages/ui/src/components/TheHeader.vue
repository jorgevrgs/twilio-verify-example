<template>
  <header class="flex justify-center gap-8">
    <RouterLink
      class="w-16 text-center py-2 hover:font-bold"
      :class="isActive('Home') ? 'underline underline-offset-8' : ''"
      :to="{ name: 'Home' }"
      >Home</RouterLink
    >
    <RouterLink
      class="w-16 text-center py-2 hover:font-bold"
      :class="isActive('Register') ? 'underline underline-offset-8' : ''"
      :to="{ name: 'Register' }"
      >Register</RouterLink
    >
    <RouterLink
      class="w-16 text-center py-2 hover:font-bold"
      :class="isActive('Login') ? 'underline underline-offset-8' : ''"
      :to="{ name: 'Login' }"
      >Login</RouterLink
    >
    <RouterLink
      class="w-16 text-center py-2 hover:font-bold"
      :class="isActive('Dashboard') ? 'underline underline-offset-8' : ''"
      :to="{ name: 'Dashboard' }"
      >Dashboard</RouterLink
    >
  </header>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const isActive = (name: string) => route.name === name;
</script>

<style scoped></style>
