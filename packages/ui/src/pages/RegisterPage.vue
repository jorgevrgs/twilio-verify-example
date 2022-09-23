<template>
  <h1>Register</h1>
  <RegisterForm />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RegisterForm from '../features/register/components/RegisterForm.vue';

export default defineComponent({
  setup() {
    return {};
  },
  components: { RegisterForm },
});
</script>

<style scoped></style>
