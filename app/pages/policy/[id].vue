<script setup lang="ts">
// 백엔드 정책 상세 API 응답 타입
interface PolicyDetail {
  id: number;
  policy_id: string;
  title: string;
  ministry: string;
  summary: string;
  source_type: string;
  ctpv_nm: string;
  sgg_nm: string;
  support_cycle: string;
  support_provision: string;
  support_content: string;
  target_group: string;
  target_detail: string;
  selection_criteria: string;
  application_method: string;
  application_detail: string;
  phone: string;
  website: string;
}

const route = useRoute();
const router = useRouter();

const policyId = route.params.id as string;

// 백엔드에서 상세 정보 가져오기
const { data: policy, pending, error } = await useFetch<PolicyDetail>(
  `http://localhost:8000/welfare/policies/${policyId}`
);

const goBack = () => {
  router.back();
};

// 지역 표시
const regionLabel = computed(() => {
  if (policy.value?.ctpv_nm) {
    return policy.value.sgg_nm
      ? `${policy.value.ctpv_nm} ${policy.value.sgg_nm}`
      : policy.value.ctpv_nm;
  }
  return '';
});

// 소스 타입 라벨
const sourceLabel = computed(() => {
  const type = policy.value?.source_type;
  if (type === 'central') return '중앙정부';
  if (type === 'regional') return '지자체';
  return '';
});
</script>

<template>
  <div class="flex flex-col min-h-[100dvh] bg-gray-50">
    <!-- Header -->
    <header class="flex items-center px-4 py-3 bg-white border-b border-gray-100 shadow-sm z-10">
      <button @click="goBack" class="p-2 -ml-2 text-gray-600 rounded-full hover:bg-gray-100 active:scale-95">
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <h1 class="ml-2 text-lg font-bold text-gray-900">정책 상세</h1>
    </header>

    <!-- 로딩 상태 -->
    <div v-if="pending" class="flex-1 flex items-center justify-center">
      <div class="text-gray-500">로딩 중...</div>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error || !policy" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <p class="text-gray-500 mb-4">정책 정보를 불러올 수 없습니다.</p>
        <button @click="goBack" class="text-primary font-medium">돌아가기</button>
      </div>
    </div>

    <!-- 콘텐츠 -->
    <main v-else class="flex-1 px-4 py-6 pb-24">
      <article class="max-w-2xl mx-auto bg-white rounded-3xl shadow-card overflow-hidden">
        <!-- 헤더 영역 -->
        <div class="p-6 border-b border-gray-100">
          <div class="flex flex-wrap gap-2 mb-3">
            <span v-if="sourceLabel" class="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
              {{ sourceLabel }}
            </span>
            <span v-if="regionLabel" class="px-3 py-1 text-xs font-medium text-green-600 bg-green-50 rounded-full">
              {{ regionLabel }}
            </span>
            <span v-if="policy.support_provision" class="px-3 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded-full">
              {{ policy.support_provision }}
            </span>
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">{{ policy.title }}</h2>
          <p v-if="policy.ministry" class="text-sm text-gray-500">{{ policy.ministry }}</p>
        </div>

        <!-- 본문 영역 -->
        <div class="p-6 space-y-6">
          <!-- 지원 내용 -->
          <section v-if="policy.support_content">
            <h3 class="text-sm font-bold text-primary mb-2 flex items-center gap-1">
              <span class="material-symbols-outlined text-lg">payments</span>
              지원 내용
            </h3>
            <p class="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px]">{{ policy.support_content }}</p>
          </section>

          <!-- 구분선 -->
          <hr v-if="policy.support_content && (policy.target_detail || policy.selection_criteria)" class="border-gray-100" />

          <!-- 지원 대상 -->
          <section v-if="policy.target_detail || policy.selection_criteria">
            <h3 class="text-sm font-bold text-primary mb-2 flex items-center gap-1">
              <span class="material-symbols-outlined text-lg">group</span>
              지원 대상
            </h3>
            <p v-if="policy.target_detail" class="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px] mb-2">
              {{ policy.target_detail }}
            </p>
            <p v-if="policy.selection_criteria" class="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px]">
              {{ policy.selection_criteria }}
            </p>
          </section>

          <!-- 구분선 -->
          <hr v-if="(policy.target_detail || policy.selection_criteria) && (policy.application_method || policy.application_detail)" class="border-gray-100" />

          <!-- 신청 방법 -->
          <section v-if="policy.application_method || policy.application_detail">
            <h3 class="text-sm font-bold text-primary mb-2 flex items-center gap-1">
              <span class="material-symbols-outlined text-lg">edit_document</span>
              신청 방법
            </h3>
            <p v-if="policy.application_method" class="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px] mb-2">
              {{ policy.application_method }}
            </p>
            <p v-if="policy.application_detail" class="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px]">
              {{ policy.application_detail }}
            </p>
          </section>

          <!-- 구분선 -->
          <hr v-if="(policy.application_method || policy.application_detail) && (policy.phone || policy.ministry)" class="border-gray-100" />

          <!-- 문의처 -->
          <section v-if="policy.phone || policy.ministry">
            <h3 class="text-sm font-bold text-primary mb-2 flex items-center gap-1">
              <span class="material-symbols-outlined text-lg">contact_phone</span>
              문의처
            </h3>
            <div class="text-gray-700 text-[15px] space-y-1">
              <p v-if="policy.ministry">
                <span class="text-gray-500">담당부처</span>
                <span class="mx-2 text-gray-300">|</span>
                {{ policy.ministry }}
              </p>
              <p v-if="policy.phone">
                <span class="text-gray-500">문의전화</span>
                <span class="mx-2 text-gray-300">|</span>
                <a :href="'tel:' + policy.phone" class="text-primary hover:underline">{{ policy.phone }}</a>
              </p>
            </div>
          </section>
        </div>
      </article>
    </main>

    <!-- 하단 신청 버튼 -->
    <div v-if="policy?.website" class="fixed bottom-0 left-0 right-0 px-4 py-4 bg-white border-t border-gray-100 shadow-lg">
      <div class="max-w-2xl mx-auto">
        <a
          :href="policy.website"
          target="_blank"
          class="flex items-center justify-center w-full py-4 text-base font-bold text-white bg-primary rounded-2xl hover:bg-primary-hover active:scale-[0.98] transition-all"
        >
          신청하러 가기
          <span class="material-symbols-outlined ml-1">open_in_new</span>
        </a>
      </div>
    </div>
  </div>
</template>
