<script setup lang="ts">
interface DashboardSummary {
  total_matches: number;
  new_matches: number;
  profile_completion_score: number;
  next_deadline?: string;
  recent_activities_count: number;
}

interface PolicyRecommendation {
  id: string;
  title: string;
  category: string;
  region: string;
  deadline?: string;
  match_score: number;
}

interface PersonalizedFeed {
  total_count: number;
  recommendations: PolicyRecommendation[];
}

const router = useRouter();
const config = useRuntimeConfig();

// State
const summary = ref<DashboardSummary | null>(null);
const feed = ref<PersonalizedFeed | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Fetch Data
const fetchDashboardData = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    const [summaryData, feedData] = await Promise.all([
      $fetch<DashboardSummary>('/api/dashboard/summary', { headers }),
      $fetch<PersonalizedFeed>('/api/dashboard/personalized', { headers })
    ]);

    summary.value = summaryData;
    feed.value = feedData;
  } catch (err) {
    console.error('Failed to fetch dashboard data', err);
    error.value = '데이터를 불러오는데 실패했습니다.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});

// Actions
const goToChatWithPolicy = (policyId: string) => {
  // Contextual Pivot: Navigate to chat with pre-loaded policy context
  // We can pass this via query param or store, but API spec says POST to /chat/conversation
  // However, for frontend navigation, we might need to initiate the chat page and then let it handle the context.
  // Or we can simple push to chat and pass a query param that Chat page handles.
  
  // Let's us query param for simplicity and update Chat page to handle it if needed, 
  // OR just assume the user wants to talk about it and we send the POST request in the background?
  // The spec says: "When a user clicks a policy... frontend should navigate to Chat and use payload..."
  // This implies the Chat page logic should handle this. 
  // Let's pass it as a query param `policy_id` to `/chat`.
  router.push({ path: '/chat', query: { policy_id: policyId } });
};

const goToResults = () => {
  router.push('/result');
};
</script>

<template>
  <div class="flex flex-col min-h-[100dvh] bg-gray-50">
    <!-- Header -->
    <header class="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
      <div class="flex items-center justify-between max-w-5xl px-4 py-3 mx-auto">
        <h1 class="text-xl font-bold text-gray-900">대시보드</h1>
        <div class="flex items-center gap-3">
            <button @click="router.push('/chat')" class="p-2 text-gray-600 hover:text-primary transition-colors">
                <span class="material-symbols-outlined">chat_bubble</span>
            </button>
            <div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                <!-- Profile Placeholder -->
                <span class="material-symbols-outlined text-gray-400 p-1">person</span>
            </div>
        </div>
      </div>
    </header>

    <main class="flex-1 max-w-5xl w-full mx-auto px-4 py-6 space-y-8">
      
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-500 mb-4">{{ error }}</p>
        <button @click="fetchDashboardData" class="text-primary underline">다시 시도</button>
      </div>

      <template v-else>
        <!-- Summary Section -->
        <section v-if="summary" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Total Matches -->
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow cursor-pointer" @click="goToResults">
                <p class="text-gray-500 text-sm font-medium mb-1">매칭된 지원금</p>
                <p class="text-4xl font-bold text-primary">{{ summary.total_matches }}<span class="text-lg text-gray-400 font-normal ml-1">건</span></p>
                <p v-if="summary.new_matches > 0" class="mt-2 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                    +{{ summary.new_matches }} new
                </p>
            </div>

            <!-- Profile Score -->
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                <p class="text-gray-500 text-sm font-medium mb-1">프로필 완성도</p>
                <div class="relative w-24 h-24 flex items-center justify-center my-2">
                     <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                            class="text-gray-100"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="3"
                        />
                        <path
                            class="text-primary transition-all duration-1000 ease-out"
                            :stroke-dasharray="`${summary.profile_completion_score}, 100`"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="3"
                        />
                    </svg>
                    <span class="absolute text-xl font-bold text-gray-800">{{ summary.profile_completion_score }}%</span>
                </div>
                 <button @click="router.push('/onboarding')" class="text-xs text-primary font-medium hover:underline">프로필 업데이트</button>
            </div>

            <!-- Next Deadline / Recent Activity -->
             <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                <p class="text-gray-500 text-sm font-medium mb-3">주요 알림</p>
                <div v-if="summary.next_deadline" class="mb-3">
                    <p class="text-xs text-gray-400">마감 임박</p>
                    <p class="text-lg font-bold text-gray-800">{{ summary.next_deadline }}</p>
                </div>
                <div>
                     <p class="text-xs text-gray-400">최근 활동</p>
                    <p class="text-lg font-bold text-gray-800">{{ summary.recent_activities_count }}건의 조회</p>
                </div>
            </div>
        </section>

        <!-- Personalized Feed -->
        <section v-if="feed && feed.recommendations.length > 0">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-bold text-gray-900">맞춤 추천 정책 <span class="ml-1 text-primary">{{ feed.total_count }}</span></h2>
                <button class="text-sm text-gray-500 hover:text-gray-800">전체보기</button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                    v-for="policy in feed.recommendations" 
                    :key="policy.id"
                    @click="goToChatWithPolicy(policy.id)"
                    class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                    <div class="flex justify-between items-start mb-3">
                        <span class="px-2 py-1 text-[10px] font-bold text-blue-600 bg-blue-50 rounded-md">
                            {{ policy.category }}
                        </span>
                        <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            {{ Math.round(policy.match_score * 100) }}% 일치
                        </span>
                    </div>
                    <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-2">{{ policy.title }}</h3>
                    <p class="text-sm text-gray-500 mb-4">{{ policy.region }}</p>
                    
                    <div class="flex items-center justify-between pt-3 border-t border-gray-50">
                        <span v-if="policy.deadline" class="text-xs text-gray-400 flex items-center">
                            <span class="material-symbols-outlined text-[14px] mr-1">calendar_today</span>
                            ~{{ policy.deadline }}
                        </span>
                        <span v-else class="text-xs text-gray-400">상시 접수</span>

                        <span class="text-xs font-bold text-primary flex items-center">
                            상담하기
                            <span class="material-symbols-outlined text-[16px] ml-0.5 arrow-icon transition-transform group-hover:translate-x-1">arrow_forward</span>
                        </span>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Empty State for Feed -->
        <section v-else class="py-12 text-center bg-white rounded-2xl border border-gray-100 border-dashed">
            <div class="text-4xl mb-3">🔍</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">아직 추천된 정책이 없어요</h3>
            <p class="text-gray-500 mb-6">프로필을 완성하면 딱 맞는 혜택을 찾아드릴게요!</p>
            <button @click="router.push('/onboarding')" class="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
                프로필 완성하러 가기
            </button>
        </section>
      </template>

    </main>
  </div>
</template>

<style scoped>
.arrow-icon {
    display: inline-block;
}
</style>
