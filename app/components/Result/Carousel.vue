<script setup lang="ts">
const carouselRef = ref<HTMLElement | null>(null);

const scroll = (direction: 'left' | 'right') => {
  if (!carouselRef.value) return;
  const scrollAmount = 300; // 카드 너비 + 간격
  carouselRef.value.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth',
  });
};
</script>

<template>
  <div class="relative group">
    <!-- 좌측 버튼 -->
    <button
      @click="scroll('left')"
      class="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-primary transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
      aria-label="이전"
    >
      <span class="material-symbols-outlined">chevron_left</span>
    </button>

    <!-- 캐러셀 -->
    <div
      ref="carouselRef"
      class="flex w-full px-6 pb-8 overflow-x-auto snap-x snap-mandatory space-x-4 no-scrollbar scroll-smooth"
    >
      <slot />
    </div>

    <!-- 우측 버튼 -->
    <button
      @click="scroll('right')"
      class="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-primary transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
      aria-label="다음"
    >
      <span class="material-symbols-outlined">chevron_right</span>
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
