<template>
  <div class="flex w-full mb-4 justify-start items-start gap-2 animate-fade-in-up">
    <!-- 캐릭터 아바타 (ChatBubble과 동일) -->
    <div class="flex-shrink-0 mr-1">
      <div class="p-0.5 bg-white rounded-full shadow-sm border border-gray-100">
        <img
          src="/benny_pick_profile.png"
          alt="Benny Pick"
          class="w-11 h-11 rounded-full object-cover"
        />
      </div>
    </div>
    <!-- 타이핑 버블 -->
    <div class="px-5 py-4 bg-white shadow-card rounded-2xl rounded-tl-none border border-gray-100">
      <div class="flex space-x-1.5">
        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-0"></div>
        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.delay-0 { animation-delay: 0ms; }
.delay-150 { animation-delay: 150ms; }
.delay-300 { animation-delay: 300ms; }

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
