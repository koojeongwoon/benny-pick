<script setup lang="ts">
defineProps<{
  options: string[];
}>();

defineEmits<{
  (e: 'select', option: string): void;
}>();
</script>

<template>
  <div class="flex w-full pb-2 overflow-x-auto no-scrollbar space-x-2">
    <button
      v-for="option in options"
      :key="option"
      @click="$emit('select', option)"
      class="flex-shrink-0 px-4 py-2 text-sm font-medium text-primary bg-primary-light rounded-full hover:bg-primary hover:text-white transition-colors duration-200 active:scale-95"
    >
      {{ option }}
    </button>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
