<template>
  <div class="flex w-full h-screen bg-gray-300 md:p-8">
    <div
      class="w-full min-h-full bg-white md:max-w-xl md:mx-auto p-8 rounded-md"
    >
      <TheHeader />
      <TheBody />
      <TheFooter />
    </div>
  </div>
</template>

<script lang="ts" setup>
import TheBody from '../components/TheBody.vue';
import TheFooter from '../components/TheFooter.vue';
import TheHeader from '../components/TheHeader.vue';
</script>

<style scoped></style>
