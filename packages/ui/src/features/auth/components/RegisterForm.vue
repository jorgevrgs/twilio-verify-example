<script setup lang="ts">
import type { CountryCode } from 'libphonenumber-js';
import { ToasterHandler, ToasterOptions } from 'maz-ui';
import MazBtn from 'maz-ui/components/MazBtn';
import MazInput from 'maz-ui/components/MazInput';
import MazPhoneNumberInput from 'maz-ui/components/MazPhoneNumberInput';
import MazSwitch from 'maz-ui/components/MazSwitch';
import { computed, inject, onMounted, reactive } from 'vue';
import { useAuthStore } from '../stores/register.store';
import { RegisterFormData, User } from '../types';
import VerificationCheck from './VerificationCheck.vue';

interface PhoneNumberDetails {
  isValid: false;
  countryCode: string;
  countryCallingCode: string;
  nationalNumber: string;
  type?: string;
  formatInternational: string;
  formatNational: string;
  uri: string;
  e164: string;
}

const authStore = useAuthStore();
const toast = inject<ToasterHandler>('toast');

const defaultCountryCode: CountryCode = 'CO';

const deafultPhoneNumberDetails: PhoneNumberDetails = {
  isValid: false,
  countryCode: '',
  countryCallingCode: '',
  nationalNumber: '',
  formatInternational: '',
  formatNational: '',
  uri: '',
  e164: '',
};
let phoneNumberDetails = reactive(deafultPhoneNumberDetails);

const defaultFormData: RegisterFormData = {
  username: '',
  password: '',
  phoneNumber: '',
  enableMFA: false,
};
const formData = reactive(defaultFormData);

// Computed
const isValidForm = computed(() => {
  return formData.username && formData.password && phoneNumberDetails.isValid;
});

const isVerificationFormVisible = computed(() => {
  return (
    authStore.phoneNumber &&
    authStore.sid &&
    authStore.verificationStatus === 'pending'
  );
});

// Methods
const onSubmit = async () => {
  await authStore.registerUser({
    ...formData,
    phoneNumber: phoneNumberDetails.e164,
  });
  const toastOptions: ToasterOptions = {
    position: 'top-right',
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
    toast?.success('User registered successfully', toastOptions);
  }

  // Reset forms
  Object.assign(formData, defaultFormData);
  Object.assign(phoneNumberDetails, deafultPhoneNumberDetails);
};

const onPhoneNumberUpdate = (event: PhoneNumberDetails) => {
  Object.assign(phoneNumberDetails, event);
};

// Lifecycle
onMounted(() => {
  const localString = localStorage.getItem('user');
  if (localString) {
    const user: User = JSON.parse(localString);

    authStore.$patch({
      user,
    });
  }
});
</script>

<template>
  <form
    v-if="!isVerificationFormVisible"
    @submit.prevent="onSubmit"
    class="flex flex-col gap-4 mt-8"
  >
    <MazInput
      type="text"
      id="username"
      label="Username"
      v-model="formData.username"
      aria-label="Username"
      autocomplete="username"
      required
    />

    <MazInput
      type="password"
      v-model="formData.password"
      id="password"
      label="Password"
      aria-label="Password"
      autocomplete="new-password"
      required
    />

    <MazPhoneNumberInput
      id="phoneNumber"
      label="Phone Number"
      show-code-on-list
      v-model="formData.phoneNumber"
      required
      :default-country-code="defaultCountryCode"
      @update="onPhoneNumberUpdate"
      :success="phoneNumberDetails?.isValid"
      autocomplete="tel"
    />

    <label class="flex flex-col">
      <span>Enable MFA</span>
      <MazSwitch
        id="enableMFA"
        color="primary"
        v-model="formData.enableMFA"
        required
      />
    </label>

    <MazBtn
      type="submit"
      color="primary"
      :disabled="!isValidForm"
      class="self-end"
      :loading="authStore.isLoading"
      >Submit</MazBtn
    >
  </form>

  <VerificationCheck
    v-else
    :phone-number="authStore.user.phoneNumber"
    :sid="authStore.user.verification.sid"
  />

  <hr class="my-8" />

  <p class="text-center mb-8">
    Already have an account?
    <RouterLink :to="{ name: 'Login' }">Login</RouterLink>
  </p>
</template>
