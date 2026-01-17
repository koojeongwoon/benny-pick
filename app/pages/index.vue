<script setup lang="ts">
const router = useRouter();

const startChat = () => {
  router.push('/chat');
};
</script>

<template>
  <div class="flex flex-col min-h-[100dvh] bg-gray-100">
    <!-- Main Content -->
    <main class="flex flex-col items-center justify-center flex-1 w-full max-w-md px-6 mx-auto text-center">
      
      <!-- Hero Section -->
      <div class="flex flex-col items-center space-y-8 animate-fade-in-up">
        <!-- Icon / Visual -->
        <div class="relative mb-4">
          <div class="absolute inset-0 bg-blue-400 blur-3xl opacity-20 rounded-full animate-pulse"></div>
          <div class="relative text-8xl filter drop-shadow-xl animate-float">
            💰
          </div>
        </div>

        <!-- Text Content -->
        <div class="space-y-3">
          <h1 class="text-3xl font-bold leading-tight text-gray-900 whitespace-pre-line">
            놓치고 있는 정부 지원금,
            <span class="text-primary">지금 바로 찾아보세요</span>
          </h1>
          <p class="text-lg font-medium text-gray-600 whitespace-pre-line">
            Benny Pick이 당신에게 딱 맞는
            혜택을 찾아드립니다.
          </p>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="w-full mt-12 mb-8 space-y-4 animate-fade-in-up delay-100">
        <ButtonPrimary
          label="내 숨은 돈 조회하기"
          block
          @click="startChat"
          class="text-xl"
        />
        <button
          @click="router.push('/register')"
          class="w-full py-3 text-base font-medium text-gray-600 transition-colors bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300"
        >
          회원가입하고 더 많은 혜택 받기
        </button>
      </div>

    </main>

    <!-- Simple Footer -->
    <footer class="py-6 text-center text-gray-400">
      <p class="text-xs">© 2025 Lynply. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.delay-100 {
  animation-delay: 0.2s;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
