<template>
  <section class="flex flex-col">
    <h1>Register</h1>

    <RegisterForm />

    <hr class="my-8" />

    <p class="text-center mb-8">
      Already have an account?
      <RouterLink
        class="text-blue-600 :hover:text-blue-800"
        :to="{ name: 'Login' }"
        >Log In</RouterLink
      >
    </p>
  </section>
</template>

<script lang="ts" setup>
import RegisterForm from '../features/auth/components/RegisterForm.vue';
</script>

<style scoped></style>
