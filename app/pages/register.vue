<script setup lang="ts">
const router = useRouter();

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
});

const errors = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  general: '',
});

const isLoading = ref(false);
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

// 유효성 검사
const validateForm = (): boolean => {
  let isValid = true;

  // 이름 검사
  if (!form.name.trim()) {
    errors.name = '이름을 입력해주세요';
    isValid = false;
  } else if (form.name.length < 2 || form.name.length > 50) {
    errors.name = '이름은 2~50자 사이로 입력해주세요';
    isValid = false;
  } else {
    errors.name = '';
  }

  // 이메일 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim()) {
    errors.email = '이메일을 입력해주세요';
    isValid = false;
  } else if (!emailRegex.test(form.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다';
    isValid = false;
  } else {
    errors.email = '';
  }

  // 비밀번호 검사
  if (!form.password) {
    errors.password = '비밀번호를 입력해주세요';
    isValid = false;
  } else if (form.password.length < 8) {
    errors.password = '비밀번호는 8자 이상이어야 합니다';
    isValid = false;
  } else {
    errors.password = '';
  }

  // 비밀번호 확인 검사
  if (!form.passwordConfirm) {
    errors.passwordConfirm = '비밀번호를 다시 입력해주세요';
    isValid = false;
  } else if (form.password !== form.passwordConfirm) {
    errors.passwordConfirm = '비밀번호가 일치하지 않습니다';
    isValid = false;
  } else {
    errors.passwordConfirm = '';
  }

  return isValid;
};

// 회원가입 제출
const handleSubmit = async () => {
  errors.general = '';

  if (!validateForm()) return;

  isLoading.value = true;

  try {
    const response = await $fetch<TokenResponse>('/api/auth/register', {
      method: 'POST',
      body: {
        name: form.name.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
      },
    });

    // 토큰 저장
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));

    // 온보딩 페이지로 이동
    router.push('/onboarding');
  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.data?.message) {
      errors.general = error.data.message;
    } else if (error.statusCode === 400) {
      errors.general = '이미 등록된 이메일입니다';
    } else {
      errors.general = '회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
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
        <h1 class="text-lg font-semibold text-gray-900">회원가입</h1>
        <div class="w-10"></div>
      </div>
    </header>

    <!-- Form -->
    <main class="flex-1 overflow-y-auto">
      <div class="max-w-md px-6 py-8 mx-auto mt-10 bg-white shadow-xl rounded-2xl">
        <!-- Welcome Text -->
        <div class="mb-8 text-center">
          <div class="mb-4 text-5xl">👋</div>
          <h2 class="text-2xl font-bold text-gray-900">반가워요!</h2>
          <p class="mt-2 text-gray-600">베니픽에서 나만의 혜택을 찾아보세요</p>
        </div>

        <!-- Error Message -->
        <div v-if="errors.general" class="p-4 mb-6 text-sm text-red-600 bg-red-50 rounded-xl">
          {{ errors.general }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- 이름 -->
          <div>
            <label for="name" class="block mb-2 text-sm font-medium text-gray-700">이름</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="이름을 입력해주세요"
              :class="[
                'w-full px-4 py-3 text-base border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors',
                errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
              ]"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
          </div>

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
                placeholder="8자 이상 입력해주세요"
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

          <!-- 비밀번호 확인 -->
          <div>
            <label for="passwordConfirm" class="block mb-2 text-sm font-medium text-gray-700">비밀번호 확인</label>
            <div class="relative">
              <input
                id="passwordConfirm"
                v-model="form.passwordConfirm"
                :type="showPasswordConfirm ? 'text' : 'password'"
                placeholder="비밀번호를 다시 입력해주세요"
                :class="[
                  'w-full px-4 py-3 pr-12 text-base border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors',
                  errors.passwordConfirm ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                ]"
              />
              <button
                type="button"
                @click="showPasswordConfirm = !showPasswordConfirm"
                class="absolute text-gray-400 -translate-y-1/2 right-4 top-1/2 hover:text-gray-600"
              >
                <span class="text-xl material-symbols-outlined">
                  {{ showPasswordConfirm ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
            </div>
            <p v-if="errors.passwordConfirm" class="mt-1 text-sm text-red-500">{{ errors.passwordConfirm }}</p>
          </div>

          <!-- 가입 버튼 -->
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
              가입 중...
            </span>
            <span v-else>가입하기</span>
          </button>
        </form>

        <!-- 로그인 링크 -->
        <p class="mt-6 text-center text-gray-600">
          이미 계정이 있으신가요?
          <NuxtLink to="/login" class="font-medium text-primary hover:underline">
            로그인
          </NuxtLink>
        </p>
      </div>
    </main>
  </div>
</template>
