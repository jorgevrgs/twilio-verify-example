<template>
  <h1>Register</h1>

  <RegisterForm />

  <hr class="my-8" />

  <p class="text-center">
    Already have an account?
    <RouterLink :to="{ name: 'Login' }">Login</RouterLink>
  </p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RegisterForm from '../features/auth/components/RegisterForm.vue';

export default defineComponent({
  setup() {
    return {};
  },
  components: { RegisterForm },
});
</script>

<style scoped></style>
