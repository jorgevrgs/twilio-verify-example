<script setup lang="ts">
import type { CountryCode } from 'libphonenumber-js';
import MazBtn from 'maz-ui/components/MazBtn';
import MazInput from 'maz-ui/components/MazInput';
import MazPhoneNumberInput from 'maz-ui/components/MazPhoneNumberInput';
import MazSelect from 'maz-ui/components/MazSelect';
import MazSwitch from 'maz-ui/components/MazSwitch';
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { AsyncActions, useAuthStore } from '../stores';
import { RegisterFormData } from '../types';

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
const router = useRouter();

const defaultCountryCode: CountryCode = 'CO';
const channels = [
  {
    value: 'sms',
    label: 'SMS',
  },
  {
    value: 'call',
    label: 'Call',
  },
];

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
  channel: 'sms',
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

// Methods
const onSubmit = async () => {
  authStore.dispatchAsyncForm(
    {
      ...formData,
      phoneNumber: phoneNumberDetails.e164,
    },
    AsyncActions.REGISTER
  );
  router.push({ name: 'Verification' });
};

const onPhoneNumberUpdate = (event: PhoneNumberDetails) => {
  Object.assign(phoneNumberDetails, event);
};
</script>

<template>
  <form class="flex flex-col gap-4 mt-8">
    <MazInput
      type="text"
      id="username"
      label="Username"
      v-model="formData.username"
      aria-label="Username"
      autocomplete="username"
      required
      auto-focus
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

    <MazSelect
      v-show="formData.enableMFA"
      v-model="formData.channel"
      label="Select channel"
      :options="channels"
      orientation="col"
    />

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
</template>
