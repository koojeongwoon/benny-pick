<script setup lang="ts">
const router = useRouter();

interface UserResponse {
  id: number;
  email: string;
  name: string;
  onboarding_completed: boolean;
  profile?: {
    region?: string;
    life_cycle?: string;
    interests?: string;
  };
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: UserResponse;
}

const form = reactive({
  email: '',
  password: '',
});

const errors = reactive({
  email: '',
  password: '',
  general: '',
});

const isLoading = ref(false);
const showPassword = ref(false);

// 유효성 검사
const validateForm = (): boolean => {
  let isValid = true;

  // 이메일 검사
  if (!form.email.trim()) {
    errors.email = '이메일을 입력해주세요';
    isValid = false;
  } else {
    errors.email = '';
  }

  // 비밀번호 검사
  if (!form.password) {
    errors.password = '비밀번호를 입력해주세요';
    isValid = false;
  } else {
    errors.password = '';
  }

  return isValid;
};

// 로그인 제출
const handleSubmit = async () => {
  errors.general = '';

  if (!validateForm()) return;

  isLoading.value = true;

  try {
    const response = await $fetch<TokenResponse>('/api/auth/login', {
      method: 'POST',
      body: {
        email: form.email.toLowerCase().trim(),
        password: form.password,
      },
    });

    // 토큰 저장
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));

    // 온보딩 완료 여부에 따라 리다이렉트
    if (response.user.onboarding_completed) {
      router.push('/dashboard');
    } else {
      router.push('/onboarding');
    }
  } catch (error: any) {
    console.error('Login error:', error);

    if (error.data?.message) {
      errors.general = error.data.message;
    } else if (error.statusCode === 401) {
      errors.general = '이메일 또는 비밀번호가 올바르지 않습니다';
    } else {
      errors.general = '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col min-h-[100dvh] bg-gray-100">
    <!-- Header -->
    <header class="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div class="flex items-center justify-between max-w-5xl px-4 py-3 mx-auto">
        <button @click="router.push('/')" class="p-2 -ml-2 text-gray-600 hover:text-gray-900">
          <span class="text-2xl material-symbols-outlined">arrow_back</span>
        </button>
        <h1 class="text-lg font-semibold text-gray-900">로그인</h1>
        <div class="w-10"></div>
      </div>
    </header>

    <!-- Form -->
    <main class="flex-1 overflow-y-auto">
      <div class="max-w-md px-6 py-8 mx-auto mt-10 bg-white shadow-xl rounded-2xl">
        <!-- Welcome Text -->
        <div class="mb-8 text-center">
          <div class="mb-4 text-5xl">👋</div>
          <h2 class="text-2xl font-bold text-gray-900">다시 만나서 반가워요!</h2>
          <p class="mt-2 text-gray-600">로그인하고 나만의 혜택을 확인하세요</p>
        </div>

        <!-- Error Message -->
        <div v-if="errors.general" class="p-4 mb-6 text-sm text-red-600 bg-red-50 rounded-xl">
          {{ errors.general }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- 이메일 -->
          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-gray-700">이메일</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="example@email.com"
              :class="[
                'w-full px-4 py-3 text-base border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors',
                errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
              ]"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
          </div>

          <!-- 비밀번호 -->
          <div>
            <label for="password" class="block mb-2 text-sm font-medium text-gray-700">비밀번호</label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="비밀번호를 입력해주세요"
                :class="[
                  'w-full px-4 py-3 pr-12 text-base border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors',
                  errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                ]"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute text-gray-400 -translate-y-1/2 right-4 top-1/2 hover:text-gray-600"
              >
                <span class="text-xl material-symbols-outlined">
                  {{ showPassword ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
          </div>

          <!-- 로그인 버튼 -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-4 mt-4 text-lg font-semibold text-white transition-colors rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              로그인 중...
            </span>
            <span v-else>로그인</span>
          </button>
        </form>

        <!-- 회원가입 링크 -->
        <p class="mt-6 text-center text-gray-600">
          아직 계정이 없으신가요?
          <NuxtLink to="/register" class="font-medium text-primary hover:underline">
            회원가입
          </NuxtLink>
        </p>
      </div>
    </main>
  </div>
</template>
