<template>
  <section class="flex flex-col">
    <div class="flex justify-between">
      <h1>Profile</h1>
      <MazBtn color="danger" @click.prevent="onLogOut">Log Out</MazBtn>
    </div>

    <div class="flex flex-col gap-4">
      <MazAvatar src="https://placekitten.com/200/200" size="2.5rem" />

      <div class="flex w-full">
        <dt class="flex-1">Username:</dt>
        <dd class="flex-1">{{ authStore.user?.username }}</dd>
      </div>

      <div class="flex w-full">
        <dt class="flex-1">Phone Number</dt>
        <dd class="flex-1">
          {{ formatedPhoneNumber }}
        </dd>
      </div>

      <div class="flex w-full">
        <dt class="flex-1">Password</dt>
        <dd class="flex-1 tracking-widest">********</dd>
      </div>

      <section v-if="authStore.user?.enableMFA">
        <h2 class="text-xl">MFA</h2>

        <div class="flex w-full">
          <dt class="flex-1">Enable Two-Factor Authentication (2FA)</dt>
          <dd class="flex-1">
            <MazSwitch color="info" disabled v-model="isMFAEnbled" />
          </dd>
        </div>

        <div class="flex w-full">
          <dt class="flex-1">Channel</dt>
          <dd class="flex-1 tracking-widest">
            {{ authStore.user?.defaultChannel || 'SMS' }}
          </dd>
        </div>
      </section>
    </div>
  </section>
</template>

<script lang="ts" setup>
import parsePhoneNumber from 'libphonenumber-js';
import MazAvatar from 'maz-ui/components/MazAvatar';
import MazBtn from 'maz-ui/components/MazBtn';
import MazSwitch from 'maz-ui/components/MazSwitch';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../features/auth/stores';

const authStore = useAuthStore();
const router = useRouter();

async function onLogOut() {
  await authStore.logout();

  authStore.$reset();
  router.push({ name: 'Home' });
}

const isMFAEnbled = ref(Boolean(authStore.user?.enableMFA));

const formatedPhoneNumber = computed(() => {
  if (!authStore.user?.phoneNumber) return null;

  return parsePhoneNumber(authStore.user?.phoneNumber)?.formatInternational();
});
</script>

<style scoped></style>
