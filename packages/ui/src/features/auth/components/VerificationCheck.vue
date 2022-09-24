<template>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-4 mt-8">
    <MazInput
      type="text"
      id="verificationCode"
      label="Verification Code"
      v-model="formData.verificationCode"
      aria-label="Verification Code"
      autocomplete="one-time-code"
      placeholder="123456"
      :valid-button="isValidCode"
      required
    />
  </form>
</template>

<script setup lang="ts">
import MazInput from 'maz-ui/components/MazInput';
import { computed, reactive } from 'vue';

const LENGTH = 6;

const formData = reactive({
  verificationCode: '',
  phoneNumber: '',
});

const isValidCode = computed(() => {
  return formData.verificationCode.length === LENGTH;
});

function onSubmit() {
  console.log(formData);
}
</script>

<style lang="scss" scoped></style>
