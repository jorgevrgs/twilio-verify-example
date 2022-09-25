<script setup lang="ts">
import { ToasterHandler, ToasterOptions } from 'maz-ui';
import MazBtn from 'maz-ui/components/MazBtn';
import MazInput from 'maz-ui/components/MazInput';
import { computed, inject, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import BounceLoader from 'vue-spinner/src/BounceLoader.vue';
import { useAuthStore } from '../stores';

const router = useRouter();
const authStore = useAuthStore();
const toast = inject<ToasterHandler>('toast');

const LENGTH = 6;

// Data
const formData = reactive({
  verificationCode: '',
  phoneNumber: '',
  sid: '',
});

// Computed
const isValidCode = computed(() => {
  return formData.verificationCode.length === LENGTH;
});

// Methods
function onReset() {
  console.log('onReset');

  authStore.$reset();
  router.push({ name: 'Home' });
}

async function onSubmit() {
  await authStore.verifyCode(formData);

  const toastOptions: ToasterOptions = {
    position: 'bottom',
    timeout: 10_000,
    persistent: false,
  };

  if (authStore.error) {
    toast?.info(
      'Please try again, log in instead, or contact our customer support team if the problem persists.',
      toastOptions
    );
    toast?.error(authStore.error, toastOptions);
  } else {
    toast?.success('Code verified successfully', toastOptions);

    router.push({ name: 'Profile' });
  }
}

// Lifecycle
onMounted(() => {
  // Verify with code
  if (authStore.user?.verification) {
    formData.phoneNumber = authStore.user.phoneNumber;
    formData.sid = authStore.user.verification.sid;
  }
});
</script>

<template>
  <form
    v-if="authStore.isPhoneVerificationInProgress"
    class="flex flex-col gap-4 mt-8"
  >
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
        :disabled="authStore.isLoading"
        @click.prevent="onReset"
        >Cancel</MazBtn
      >

      <MazBtn
        type="submit"
        color="primary"
        @click.prevent="onSubmit"
        :disabled="!isValidCode"
        :loading="authStore.isLoading"
        >Submit</MazBtn
      >
    </div>
  </form>
  <div v-else class="flex justify-center items-center">
    <BounceLoader />
  </div>
</template>

<style lang="scss" scoped></style>
