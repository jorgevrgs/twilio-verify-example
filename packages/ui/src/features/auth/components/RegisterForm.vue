<script setup lang="ts">
import type { CountryCode } from 'libphonenumber-js';
import { ToasterHandler, ToasterOptions } from 'maz-ui';
import MazBtn from 'maz-ui/components/MazBtn';
import MazInput from 'maz-ui/components/MazInput';
import MazPhoneNumberInput from 'maz-ui/components/MazPhoneNumberInput';
import MazSwitch from 'maz-ui/components/MazSwitch';
import { computed, inject, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/register.store';
import { RegisterFormData } from '../types';
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

const router = useRouter();
const authStore = useAuthStore();
const toast = inject<ToasterHandler>('toast');

const defaultCountryCode: CountryCode = 'CO';

const defaultPhoneNumberDetails: PhoneNumberDetails = {
  isValid: false,
  countryCode: '',
  countryCallingCode: '',
  nationalNumber: '',
  formatInternational: '',
  formatNational: '',
  uri: '',
  e164: '',
};
let phoneNumberDetails = reactive(defaultPhoneNumberDetails);

const defaultFormData: RegisterFormData = {
  username: '',
  password: '',
  phoneNumber: '',
  enableMFA: false,
};
const formData = reactive<RegisterFormData>(defaultFormData);

// Computed
const isValidForm = computed(() => {
  return (
    Boolean(formData.username) &&
    Boolean(formData.password) &&
    phoneNumberDetails.isValid
  );
});

const isVerificationFormVisible = computed(() => {
  return (
    authStore.isVerificationRequired &&
    authStore.phoneNumber &&
    authStore.sid &&
    authStore.verificationStatus === 'pending'
  );
});

// Methods
const onSubmit = async (e: Event) => {
  console.log('onSubmit');

  e.preventDefault();

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
    if (!authStore.isVerificationRequired) {
      toast?.success(
        'Check your mobile phone and fill out the form below with the code',
        toastOptions
      );

      router.push({ name: 'Profile' });
    } else {
      toast?.success('User registered successfully!', toastOptions);
    }
  }

  // Reset forms
  Object.assign(formData, defaultFormData);
  Object.assign(phoneNumberDetails, defaultPhoneNumberDetails);
};

const onPhoneNumberUpdate = (event: PhoneNumberDetails) => {
  Object.assign(phoneNumberDetails, event);
};
</script>

<template>
  <VerificationCheck
    v-if="isVerificationFormVisible"
    :phone-number="authStore.user.phoneNumber"
    :sid="authStore.sid ?? ''"
    next="Profile"
  />

  <form v-else class="flex flex-col gap-4 mt-8">
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

    <div class="flex justify-end">
      <MazBtn
        @click.prevent="onSubmit"
        type="submit"
        color="primary"
        :disabled="!isValidForm"
        :loading="authStore.isLoading"
        >Submit</MazBtn
      >
    </div>
  </form>

  <hr class="my-8" />

  <p class="text-center mb-8">
    Already have an account?
    <RouterLink :to="{ name: 'Login' }">Login</RouterLink>
  </p>
</template>
