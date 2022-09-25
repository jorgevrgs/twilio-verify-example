<template>
  <section class="flex flex-col">
    <h1>Login</h1>

    <LoginForm />

    <hr class="my-8" />

    <p class="text-center mb-8">
      Don’t have an account yet?
      <RouterLink
        class="text-blue-600 :hover:text-blue-800"
        :to="{ name: 'Register' }"
        >Sign up for free.</RouterLink
      >
    </p>
  </section>
</template>

<script lang="ts" setup>
import LoginForm from '../features/auth/components/LoginForm.vue';
</script>

<style scoped></style>
