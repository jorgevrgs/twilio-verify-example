<script setup lang="ts">
import type { CountryCode } from 'libphonenumber-js';
import { ToasterHandler, ToasterOptions } from 'maz-ui';
import MazBtn from 'maz-ui/components/MazBtn';
import MazInput from 'maz-ui/components/MazInput';
import MazPhoneNumberInput from 'maz-ui/components/MazPhoneNumberInput';
import MazSwitch from 'maz-ui/components/MazSwitch';
import { computed, inject, reactive } from 'vue';
import { useRegisterStore } from '../stores/register.store';
import { FormData } from '../types';

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

const registerStore = useRegisterStore();
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

const defaultFormData: FormData = {
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

// Methods
const onSubmit = async () => {
  await registerStore
    .registerUser({
      ...formData,
      phoneNumber: phoneNumberDetails.e164,
    })
    .then(() => {
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
        toast?.success('User registered successfully', toastOptions);
      }
    });
};

const onPhoneNumberUpdate = (event: PhoneNumberDetails) => {
  Object.assign(phoneNumberDetails, event);
};
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-4 mt-8">
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
      :loading="registerStore.isLoading"
      >Submit</MazBtn
    >
  </form>
</template>
