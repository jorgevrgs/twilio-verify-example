<template>
  <section class="flex flex-col">
    <div class="flex justify-between">
      <h1>Profile</h1>
      <MazBtn color="danger" @click.prevent="onLogOut">Log Out</MazBtn>
    </div>
  </section>
</template>

<script lang="ts" setup>
import MazBtn from 'maz-ui/components/MazBtn';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../features/auth/stores/register.store';

const authStore = useAuthStore();
const router = useRouter();

async function onLogOut() {
  await authStore.logout();

  router.push({ name: 'Home' });
}
</script>

<style scoped></style>
