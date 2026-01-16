<script setup lang="ts">
const router = useRouter();
const store = usePolicyStore();

// Redirect if no data
if (!store.value.policies || store.value.policies.length === 0) {
  // Optional: Redirect back to chat if accessed directly without data
  // router.replace('/chat');
}

const policies = computed(() => store.value.policies || []);

const totalAmount = computed(() => {
  if (policies.value.length === 0) return '0원';
  // Calculate amount: 200,000 KRW per policy (heuristic)
  const amount = policies.value.length * 200000;
  return amount.toLocaleString() + '원';
});

const restart = () => {
  store.value.policies = [];
  store.value.intent = {};
  router.push('/chat');
};

const goBack = () => {
  router.back();
};

const goToPolicy = (id: string) => {
  router.push(`/policy/${id}`);
};
</script>

<template>
  <div class="flex flex-col min-h-[100dvh] bg-gray-50">
    <!-- Header -->
    <header class="flex items-center px-4 py-3 bg-white border-b border-gray-100 shadow-sm z-10">
      <button @click="goBack" class="p-2 -ml-2 text-gray-600 rounded-full hover:bg-gray-100 active:scale-95">
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <h1 class="ml-2 text-lg font-bold text-gray-900">Benny Pick</h1>
    </header>

    <!-- Summary Section -->
    <section class="flex flex-col items-center px-6 mt-4 mb-8 text-center animate-fade-in-up">
      <div class="mb-2 text-4xl animate-bounce">🎉</div>
      <h2 class="text-xl font-bold text-gray-800">
        <span class="text-primary">{{ policies.length }}건</span>의 숨은 지원금을<br>찾았어요!
      </h2>
      <div class="mt-6 p-6 bg-white rounded-3xl shadow-toss w-full max-w-sm">
        <p class="text-sm text-gray-500 mb-1">예상 수령액</p>
        <p class="text-3xl font-bold text-gray-900">{{ totalAmount }}</p>
      </div>
    </section>

    <!-- Carousel Section -->
    <section class="flex-1 w-full mb-8 animate-fade-in-up delay-100">
      <div v-if="policies.length > 0" class="px-6 mb-3">
        <h3 class="text-lg font-bold text-gray-900">맞춤 혜택 리스트</h3>
      </div>
      <ResultCarousel>
        <ResultCard
          v-for="policy in policies"
          :key="policy.id"
          :id="policy.id"
          :title="policy.title"
          :description="policy.description"
          :amount="policy.benefit_summary"
          :tags="[policy.category, policy.region].filter(Boolean)"
          :link="policy.apply_url"
          @click="goToPolicy"
        />
      </ResultCarousel>
    </section>

    <!-- Actions -->
    <div class="px-6 pb-8 space-y-3 animate-fade-in-up delay-200">
      <ButtonPrimary label="다시 찾기" block @click="restart" />
      <button class="w-full py-4 text-sm font-bold text-gray-500 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors">
        카카오톡으로 공유하기
      </button>
    </div>

    <!-- Disclaimer Footer -->
    <footer class="py-6 text-center bg-gray-100">
      <p class="text-xs text-gray-400">
        * 본 결과는 모의 계산 결과로 법적 효력이 없습니다.<br>
        정확한 내용은 각 신청 사이트에서 확인해주세요.
      </p>
    </footer>
  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.delay-100 { animation-delay: 0.2s; }
.delay-200 { animation-delay: 0.4s; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
