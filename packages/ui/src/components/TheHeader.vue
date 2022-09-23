<template>
  <header class="flex justify-center gap-8">
    <RouterLink :to="{ name: 'Home' }">Home</RouterLink>
    <RouterLink :to="{ name: 'Register' }">Register</RouterLink>
    <RouterLink :to="{ name: 'Login' }">Login</RouterLink>
    <RouterLink :to="{ name: 'Dashboard' }">Dashboard</RouterLink>
  </header>
</template>

<script setup lang="ts"></script>

<style scoped></style>
