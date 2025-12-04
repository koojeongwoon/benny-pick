<template>
  <div class="flex w-full mb-4 justify-start animate-fade-in-up">
    <div class="px-5 py-4 bg-white shadow-card rounded-2xl rounded-tl-none">
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
