<template>
  <form class="flex flex-col gap-4 mt-8">
    <label class="flex flex-col">
      <span>Username</span>
      <input
        class="form-input"
        type="text"
        v-model="formData.username"
        aria-label="Username"
        autocomplete="username"
      />
    </label>

    <label class="flex flex-col">
      <span>Password</span>
      <input
        class="form-input"
        type="password"
        v-model="formData.password"
        aria-label="Password"
        autocomplete="password"
      />
    </label>

    <label class="flex flex-col">
      <span>Phone Number</span>
      <input
        class="form-input"
        type="tel"
        v-model="formData.phoneNumber"
        placeholder="573001234567"
        aria-label="Phone Number"
        autocomplete="tel"
      />
    </label>

    <ToggleCheckbox v-model="formData.enableMFA" label="Enable MFA" />
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ToggleCheckbox from '../../../components/ToggleCheckbox.vue';

export default defineComponent({
  data: () => ({
    formData: {
      username: '',
      password: '',
      phoneNumber: '',
      enableMFA: false,
    },
  }),
  components: { ToggleCheckbox },
});
</script>
