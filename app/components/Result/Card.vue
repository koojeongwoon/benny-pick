<script setup lang="ts">
defineProps<{
  title: string;
  amount: string;
  description: string;
  tags?: string[];
  icon?: string;
  link?: string;
}>();
</script>

<template>
  <div class="relative flex flex-col flex-shrink-0 w-[280px] p-6 bg-white border border-gray-100 shadow-card rounded-3xl snap-center">
    <!-- Icon & Tags -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center justify-center w-12 h-12 text-2xl bg-gray-50 rounded-2xl">
        {{ icon || '🎁' }}
      </div>
      <div v-if="tags && tags.length" class="flex gap-1">
        <span
          v-for="tag in tags"
          :key="tag"
          class="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <h3 class="mb-1 text-lg font-bold text-gray-900 line-clamp-1">{{ title }}</h3>
    <p class="mb-4 text-sm text-gray-500 line-clamp-2">{{ description }}</p>
    
    <div class="mt-auto">
      <div class="mb-4 text-2xl font-bold text-primary">{{ amount }}</div>
      
      <a
        v-if="link"
        :href="link"
        target="_blank"
        class="flex items-center justify-center w-full py-3 text-sm font-bold text-white transition-colors rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.98]"
      >
        신청하러 가기
      </a>
    </div>
  </div>
</template>
