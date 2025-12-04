<script setup lang="ts">
defineProps<{
  label?: string;
  block?: boolean;
}>();
</script>

<template>
  <button
    class="relative flex items-center justify-center px-6 py-4 font-bold text-white transition-all duration-200 ease-out rounded-2xl bg-primary hover:bg-primary-hover active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[
      block ? 'w-full' : '',
      'shadow-toss hover:shadow-lg hover:-translate-y-0.5'
    ]"
  >
    <slot>{{ label }}</slot>
  </button>
</template>
