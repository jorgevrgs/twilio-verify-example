<template>
  <form class="flex flex-col gap-4 mt-8">
    <div class="p-4 bg-blue-200">
      <MazIcon name="information-circle" size="1rem" />
      {{ authStore.verification?.channel === 'sms' ? 'A message' : 'A call' }}
      has been sent to your phone number
      <span class="font-semibold">{{ formatedPhoneNumber }}</span
      >. Please enter the code below before it expires in
      <span class="font-bold font-mono">{{ formattedTimeToExpire }}</span
      >.
    </div>

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
      auto-focus
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
</template>

<script setup lang="ts">
import parsePhoneNumber from 'libphonenumber-js';
import { ToasterHandler } from 'maz-ui';
import MazBtn from 'maz-ui/components/MazBtn';
import MazIcon from 'maz-ui/components/MazIcon';
import MazInput from 'maz-ui/components/MazInput';
import {
  computed,
  inject,
  onBeforeMount,
  onBeforeUnmount,
  reactive,
  ref,
} from 'vue';
import { useRouter } from 'vue-router';
import { getSecondsToExpire } from '../../../utils/dates';
import { hidePartOfString } from '../../../utils/strings';
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

const timer = ref<NodeJS.Timer>();
const secondsToExpire = ref(
  getSecondsToExpire(authStore.verification?.updatedAt as string)
);
const formattedTimeToExpire = computed(() => {
  const minutes = Math.floor(secondsToExpire.value / 60);
  const seconds = secondsToExpire.value % 60;

  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
});

// Computed
const isValidCode = computed(() => {
  return formData.verificationCode.length === LENGTH;
});
const formatedPhoneNumber = computed(() => {
  if (!authStore.user?.phoneNumber) return null;

  const str =
    parsePhoneNumber(authStore.user?.phoneNumber)?.formatInternational() || '';

  return hidePartOfString(str);
});

// Methods
async function onReset() {
  await authStore.logout();
  authStore.$reset();
  router.push({ name: 'Home' });
}

async function onSubmit() {
  await authStore.verifyCode(formData);

  if (authStore.error) {
    toast?.info(
      'Please try again, log in instead, or contact our customer support team if the problem persists.'
    );
    toast?.error(authStore.error);
  } else {
    toast?.success('Code verified successfully');

    router.push({ name: 'Profile' });
  }
}

onBeforeMount(() => {
  timer.value = setInterval(() => {
    if (secondsToExpire.value <= 0) {
      clearInterval(timer.value);
    } else {
      secondsToExpire.value--;
    }
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timer.value);
});
</script>

<style lang="scss" scoped></style>
