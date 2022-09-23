<template>
  <div class="flex justify-center">
    <label for="toogleButton" class="flex items-center cursor-pointer">
      <div class="px-2">{{ label }}</div>
      <!-- toggle -->
      <div class="relative">
        <input
          id="toogleButton"
          type="checkbox"
          class="hidden"
          :value="modelValue"
          @change="toggleValue"
        />
        <!-- path -->
        <div
          class="toggle-path bg-gray-200 w-9 h-5 rounded-full shadow-inner"
        ></div>
        <!-- crcle -->
        <div
          class="toggle-circle absolute w-3.5 h-3.5 bg-white rounded-full shadow inset-y-0 left-0"
        ></div>
      </div>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    localValue: false,
  }),
  emits: ['update:modelValue'],
  methods: {
    toggleValue() {
      this.$emit('update:modelValue', !this.modelValue);
    },
  },
});
</script>

<style scoped>
.toggle-path {
  transition: background 0.3s ease-in-out;
}
.toggle-circle {
  top: 0.2rem;
  left: 0.25rem;
  transition: all 0.3s ease-in-out;
}
input:checked ~ .toggle-circle {
  transform: translateX(100%);
}
input:checked ~ .toggle-path {
  background-color: #81e6d9;
}
</style>
