<template>
  <section class="flex flex-col">
    <h1>Register</h1>

    <RegisterForm />
  </section>
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
