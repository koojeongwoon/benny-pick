<script setup lang="ts">
const router = useRouter();

interface UserProfile {
  region?: string;
  life_cycle?: string;
  interests?: string;
}

interface OnboardingResponse {
  response: string;
  session_id: string;
  step: string;
  profile: UserProfile;
  is_completed: boolean;
  quick_replies?: string[];
}

interface CompleteResponse {
  message: string;
  user: {
    id: number;
    email: string;
    name: string;
    onboarding_completed: boolean;
    profile: UserProfile;
  };
}

const sessionId = ref<string | null>(null);
const messages = ref<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
const userInput = ref('');
const isLoading = ref(false);
const isCompleted = ref(false);
const quickReplies = ref<string[]>([]);
const chatContainer = ref<HTMLElement | null>(null);
const currentProfile = ref<UserProfile>({});

// 토큰 확인 및 초기 메시지 로드
onMounted(async () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    router.push('/login');
    return;
  }
  await sendMessage('');
});

// 메시지 전송
const sendMessage = async (message: string) => {
  if (isLoading.value) return;

  // 사용자 메시지 추가 (빈 문자열이 아닌 경우)
  if (message.trim()) {
    messages.value.push({ role: 'user', content: message });
  }

  isLoading.value = true;
  userInput.value = '';
  quickReplies.value = [];

  try {
    const token = localStorage.getItem('access_token');
    const response = await $fetch<OnboardingResponse>('/api/onboarding/conversation', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        message,
        session_id: sessionId.value,
      },
    });

    sessionId.value = response.session_id;
    isCompleted.value = response.is_completed;
    quickReplies.value = response.quick_replies || [];
    currentProfile.value = response.profile;

    // AI 응답 추가
    messages.value.push({ role: 'assistant', content: response.response });

    // 스크롤 이동
    await nextTick();
    scrollToBottom();
  } catch (error: any) {
    console.error('Onboarding error:', error);

    // 인증 오류 시 로그인 페이지로
    if (error.statusCode === 401) {
      localStorage.removeItem('access_token');
      router.push('/login');
      return;
    }

    messages.value.push({
      role: 'assistant',
      content: '죄송해요, 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
    });
  } finally {
    isLoading.value = false;
  }
};

// 빠른 응답 선택
const selectQuickReply = (reply: string) => {
  sendMessage(reply);
};

// 스크롤 하단으로
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// 폼 제출
const handleSubmit = () => {
  if (userInput.value.trim() && !isLoading.value) {
    sendMessage(userInput.value.trim());
  }
};

// 온보딩 완료 API 호출
const completeOnboarding = async () => {
  if (!sessionId.value) return;

  try {
    const token = localStorage.getItem('access_token');
    const response = await $fetch<CompleteResponse>('/api/onboarding/complete', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        session_id: sessionId.value,
        profile: {
          region: currentProfile.value.region,
          life_cycle: currentProfile.value.life_cycle,
          interests: currentProfile.value.interests,
        },
      },
    });

    // localStorage의 user 정보 업데이트
    localStorage.setItem('user', JSON.stringify(response.user));

    return true;
  } catch (error) {
    console.error('Complete onboarding error:', error);
    return false;
  }
};

// 온보딩 완료 후 채팅으로 이동
const goToChat = async () => {
  if (isCompleted.value) {
    await completeOnboarding();
  }
  router.push('/chat');
};

// 건너뛰기 처리
const skipOnboarding = async () => {
  try {
    const token = localStorage.getItem('access_token');

    // 세션이 있으면 삭제
    if (sessionId.value) {
      await $fetch(`/api/onboarding/conversation/${sessionId.value}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {
        // 세션 삭제 실패해도 계속 진행
      });
    }

    // 빈 프로필로 완료 처리
    const response = await $fetch<CompleteResponse>('/api/onboarding/complete', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        session_id: sessionId.value || '',
        profile: {},
      },
    });

    // localStorage의 user 정보 업데이트
    localStorage.setItem('user', JSON.stringify(response.user));
  } catch (error) {
    console.error('Skip onboarding error:', error);
    // 실패해도 localStorage만 업데이트
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      user.onboarding_completed = true;
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
  router.push('/chat');
};
</script>

<template>
  <div class="flex flex-col min-h-[100dvh] bg-gray-100">
    <!-- Header -->
    <header class="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div class="flex items-center justify-between max-w-4xl px-4 py-3 mx-auto">
        <div class="w-10"></div>
        <h1 class="text-lg font-semibold text-gray-900">맞춤 설정</h1>
        <button
          v-if="!isCompleted"
          @click="skipOnboarding"
          class="text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          건너뛰기
        </button>
        <div v-else class="w-10"></div>
      </div>
    </header>

    <!-- Chat Messages -->
    <main ref="chatContainer" class="flex-1 overflow-y-auto">
      <div class="max-w-4xl px-4 py-6 mx-auto space-y-4">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="[
            'flex',
            msg.role === 'user' ? 'justify-end' : 'justify-start'
          ]"
        >
          <div
            :class="[
              'max-w-[70%] px-4 py-3 rounded-2xl whitespace-pre-line',
              msg.role === 'user'
                ? 'bg-primary text-white rounded-br-md'
                : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
            ]"
          >
            {{ msg.content }}
          </div>
        </div>

        <!-- 로딩 표시 -->
        <div v-if="isLoading" class="flex justify-start">
          <div class="px-4 py-3 bg-white shadow-sm rounded-2xl rounded-bl-md">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
          </div>
        </div>

        <!-- 완료 버튼 -->
        <div v-if="isCompleted" class="flex justify-center pt-4">
          <button
            @click="goToChat"
            class="px-8 py-3 text-lg font-semibold text-white transition-colors rounded-xl bg-primary hover:bg-primary/90"
            style="view-transition-name: start-chat-btn"
          >
            시작하기
          </button>
        </div>
      </div>
    </main>

    <!-- Quick Replies -->
    <div v-if="quickReplies.length > 0 && !isLoading" class="bg-white border-t border-gray-100">
      <div class="max-w-4xl px-4 py-3 mx-auto">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="reply in quickReplies"
            :key="reply"
            @click="selectQuickReply(reply)"
            class="px-4 py-2 text-sm font-medium transition-colors border rounded-full text-primary border-primary/30 bg-primary/5 hover:bg-primary/10"
          >
            {{ reply }}
          </button>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <footer v-if="!isCompleted" class="sticky bottom-0 bg-white border-t border-gray-200">
      <div class="max-w-4xl px-4 py-3 mx-auto">
        <form @submit.prevent="handleSubmit" class="flex gap-3">
          <input
            v-model="userInput"
            type="text"
            placeholder="직접 입력하기..."
            :disabled="isLoading"
            class="flex-1 px-4 py-3 text-base bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white disabled:opacity-50"
          />
          <button
            type="submit"
            :disabled="!userInput.trim() || isLoading"
            class="px-4 py-3 font-medium text-white transition-colors rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
</style>
