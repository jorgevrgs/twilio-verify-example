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

<script lang="ts">
import { defineComponent, inject } from 'vue';
import type { CountryCode } from 'libphonenumber-js';
import { ToasterHandler } from 'maz-ui';
import MazPhoneNumberInput from 'maz-ui/components/MazPhoneNumberInput';
import MazBtn from 'maz-ui/components/MazBtn';
import MazInput from 'maz-ui/components/MazInput';
import MazSwitch from 'maz-ui/components/MazSwitch';
import ToggleCheckbox from '../../../components/ToggleCheckbox.vue';
import { FormData } from '../types';
import { useRegisterStore } from '../stores/register.store';

interface RegisterFormProps {
  defaultCountryCode: CountryCode;
  isValidForm: boolean;
  phoneNumberDetails?: {
    isValid: false;
    countryCode: string;
    countryCallingCode: string;
    nationalNumber: string;
    type?: string;
    formatInternational: string;
    formatNational: string;
    uri: string;
    e164: string;
  };
  formData: FormData;
}

export default defineComponent({
  setup() {
    const registerStore = useRegisterStore();
    const toast = inject<ToasterHandler>('toast');

    if (registerStore.error) {
      toast?.error(registerStore.error, {
        position: 'bottom',
        timeout: 1000,
      });
    }

    return {
      registerStore,
    };
  },
  data: (): RegisterFormProps => ({
    defaultCountryCode: 'CO',
    isValidForm: false,
    phoneNumberDetails: {
      isValid: false,
      countryCode: 'CO',
      countryCallingCode: '',
      nationalNumber: '',
      type: '',
      formatInternational: '',
      formatNational: '',
      uri: '',
      e164: '',
    },
    formData: {
      username: '',
      password: '',
      phoneNumber: '',
      enableMFA: false,
    },
  }),
  components: {
    ToggleCheckbox,
    MazPhoneNumberInput,
    MazSwitch,
    MazInput,
    MazBtn,
  },
  methods: {
    resetForm() {
      this.formData = {
        username: '',
        password: '',
        phoneNumber: '',
        enableMFA: false,
      };

      this.isValidForm = false;
      this.phoneNumberDetails = undefined;
    },
    onSubmit() {
      this.registerStore.registerUser(this.formData).then(() => {
        this.resetForm();
      });
    },
    onPhoneNumberUpdate(e: RegisterFormProps['phoneNumberDetails']) {
      this.phoneNumberDetails = e;
    },
  },
  watch: {
    formData: {
      handler() {
        this.isValidForm =
          Boolean(this.phoneNumberDetails?.isValid) &&
          this.formData.username.length > 0 &&
          this.formData.password.length > 0;
      },
      deep: true,
    },
  },
});
</script>