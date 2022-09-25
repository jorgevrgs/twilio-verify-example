<script setup lang="ts">
import { ToasterHandler, ToasterOptions } from 'maz-ui';
import MazBtn from 'maz-ui/components/MazBtn';
import MazInput from 'maz-ui/components/MazInput';
import { computed, inject, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/register.store';

const router = useRouter();
const registerStore = useAuthStore();
const toast = inject<ToasterHandler>('toast');

const LENGTH = 6;

const props = defineProps({
  phoneNumber: {
    type: String,
    required: true,
  },
  sid: {
    type: String,
    required: true,
  },
  next: {
    type: String,
    required: true,
  },
});

const formData = reactive({
  verificationCode: '',
});

const isValidCode = computed(() => {
  return formData.verificationCode.length === LENGTH;
});

function onReset() {
  registerStore.$reset();
}

async function onSubmit() {
  console.log({ ...formData, phoneNumber: props.phoneNumber, sid: props.sid });

  await registerStore.verifyCode({
    ...formData,
    phoneNumber: props.phoneNumber,
    sid: props.sid,
  });

  const toastOptions: ToasterOptions = {
    position: 'top-right',
    timeout: 10_000,
    persistent: false,
  };

  if (registerStore.error) {
    toast?.info(
      'Please try again, log in instead, or contact our customer support team if the problem persists.',
      toastOptions
    );
    toast?.error(registerStore.error, toastOptions);
  } else {
    toast?.success('Code verified successfully', toastOptions);

    router.push({ name: props.next });
  }
}
</script>

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

    <div class="flex justify-end gap-8">
      <MazBtn
        type="button"
        color="danger"
        :disabled="registerStore.isLoading"
        @click.prevent="onReset"
        >Cancel</MazBtn
      >

      <MazBtn
        type="submit"
        color="primary"
        :disabled="!isValidCode"
        :loading="registerStore.isLoading"
        >Submit</MazBtn
      >
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
