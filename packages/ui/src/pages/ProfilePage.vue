<template>
  <section class="flex flex-col">
    <div class="flex justify-between">
      <h1>Profile</h1>
      <MazBtn color="danger" @click.prevent="onLogOut">Log Out</MazBtn>
    </div>

    <div class="flex flex-col gap-4">
      <MazAvatar src="https://placekitten.com/200/200" size="2.5rem" />

      <section>
        <h2 class="text-xl mb-4 mt-12 font-bold">Profile</h2>

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
          <dd class="flex-1 tracking-widest">
            ********
            <MazBtn :to="{ name: 'ChangePassword' }" size="mini">
              <MazIcon
                name="pencil"
                size="0.75rem"
                aria-label="Change Password"
              />
              <span class="ml-1">Change Password</span>
            </MazBtn>
          </dd>
        </div>
      </section>

      <section>
        <h2 class="text-xl mb-4 mt-12 font-bold">
          Enable Two-Factor Authentication (2FA)
        </h2>

        <div class="flex w-full">
          <dt class="flex-1">MFA Enabled</dt>
          <dd class="flex-1">
            <MazIcon
              :name="enableMFAIconName"
              :class="
                authStore.user?.enableMFA ? 'text-green-500' : 'text-red-500'
              "
              :aria-label="
                authStore.user?.enableMFA ? 'MFA is active' : 'MFA is inactive'
              "
            />
          </dd>
        </div>

        <div class="flex w-full" v-if="authStore.user?.enableMFA">
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
import MazIcon from 'maz-ui/components/MazIcon';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../features/auth/stores';

const authStore = useAuthStore();
const router = useRouter();

async function onLogOut() {
  await authStore.logout();

  router.push({ name: 'Home' });
}

const enableMFAIconName = computed(() =>
  authStore.user?.enableMFA ? 'check-circle' : 'x-circle'
);

const formatedPhoneNumber = computed(() => {
  if (!authStore.user?.phoneNumber) return null;

  return parsePhoneNumber(authStore.user?.phoneNumber)?.formatInternational();
});
</script>

<style scoped></style>
