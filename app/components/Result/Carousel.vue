<script setup lang="ts">
// Generic carousel container
</script>

<template>
  <div class="flex w-full px-6 pb-8 overflow-x-auto snap-x snap-mandatory space-x-4 no-scrollbar">
    <slot />
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
