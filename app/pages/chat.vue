<script setup lang="ts">
// 백엔드 API 응답 타입
interface PolicySource {
  id: string;
  title: string;
  score: number;
  description: string;
  benefit_summary: string;
  category: string;
  region: string;
  apply_url: string;
  ministry: string;
  phone: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  type?: 'text' | 'action';
  actionLabel?: string;
  actionLink?: string;
}

// 사용자 프로필 (대화에서 수집된 정보)
interface UserProfile {
  age?: number;
  region?: string;
  employment_status?: string;
  income_level?: string;
  household_type?: string;
  [key: string]: any;
}

const router = useRouter();
const messages = ref<Message[]>([
  {
    id: '1',
    role: 'assistant',
    text: '안녕하세요! Benny Pick입니다.\n어떤 도움이 필요하신가요?',
  }
]);
const userInput = ref('');
const isTyping = ref(false);
const quickReplies = ref(['나에게 맞는 지원금 찾기', '청년 월세 지원', '실업 급여']);

// 대화 세션 관리 (백엔드에서 생성된 ID 사용)
const sessionId = ref<string | null>(null);
const userProfile = ref<UserProfile>({});

const route = useRoute();

onMounted(async () => {
  const policyId = route.query.policy_id as string;
  if (policyId) {
    // 정책 ID가 있으면 바로 해당 정책에 대해 상담 요청
    // 사용자 입장에서 자연스럽게 보이도록 메시지 추가 없이 바로 호출하거나,
    // 또는 "이 정책에 대해 알려줘" 같은 메시지를 자동으로 보낼 수 있음.
    // 여기서는 API 스펙에 따라 백엔드에 알려주는 방식이 이상적이나,
    // 현재 sendMessage 구현상 텍스트가 필요함.
    // 사용자 경험을 위해:
    await sendMessage(`이 정책에 대해 자세히 알려줘: ${policyId}`);
  }
});

const messagesContainer = ref<HTMLElement | null>(null);
const chatInputRef = ref<{ focus: () => void } | null>(null);

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const sendMessage = async (text: string) => {
  if (!text.trim()) return;

  // Add User Message
  messages.value.push({
    id: Date.now().toString(),
    role: 'user',
    text: text,
  });

  userInput.value = '';
  await scrollToBottom();

  // SSE 스트리밍 호출
  isTyping.value = true;
  await scrollToBottom();

  const assistantMsgId = (Date.now() + 1).toString();
  let policies: PolicySource[] = [];

  try {
    // 새로운 conversation/stream 엔드포인트 사용
    const requestBody: { message: string; session_id?: string } = {
      message: text,
    };
    // session_id가 있으면 포함 (첫 요청 시에는 없음)
    if (sessionId.value) {
      requestBody.session_id = sessionId.value;
    }

    const token = localStorage.getItem('access_token');
    const response = await fetch('/api/chat/conversation/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error('API Error');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No reader available');
    }

    let buffer = '';
    let currentEvent = '';
    let firstTextReceived = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // 마지막 불완전한 라인은 버퍼에 유지

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // event: 타입 파싱
        if (trimmedLine.startsWith('event:')) {
          currentEvent = trimmedLine.slice(6).trim();
          continue;
        }

        // data: 내용 파싱
        if (trimmedLine.startsWith('data:')) {
          const data = trimmedLine.slice(5).trim();

          try {
            if (currentEvent === 'session') {
              // session 이벤트: 백엔드에서 생성된 세션 ID 저장
              const parsed = JSON.parse(data);
              if (parsed.session_id) {
                sessionId.value = parsed.session_id;
              }
            } else if (currentEvent === 'message') {
              // message 이벤트: AI 응답 메시지 (스트리밍)
              const parsed = JSON.parse(data);
              if (parsed.text !== undefined) {
                if (!firstTextReceived) {
                  firstTextReceived = true;
                  isTyping.value = false;
                  messages.value.push({
                    id: assistantMsgId,
                    role: 'assistant',
                    text: '',
                  });
                }
                const assistantMsg = messages.value.find(m => m.id === assistantMsgId);
                if (assistantMsg) {
                  assistantMsg.text += parsed.text;
                }
              }
            } else if (currentEvent === 'profile') {
              // profile 이벤트: 수집된 사용자 정보
              const parsed = JSON.parse(data);
              userProfile.value = { ...userProfile.value, ...parsed };
            } else if (currentEvent === 'sources') {
              // sources 이벤트: 정책 배열
              policies = JSON.parse(data);
            } else if (currentEvent === 'answer') {
              // answer 이벤트: RAG 답변 스트리밍
              const parsed = JSON.parse(data);
              if (parsed.text !== undefined) {
                if (!firstTextReceived) {
                  firstTextReceived = true;
                  isTyping.value = false;
                  messages.value.push({
                    id: assistantMsgId,
                    role: 'assistant',
                    text: '',
                  });
                }
                const assistantMsg = messages.value.find(m => m.id === assistantMsgId);
                if (assistantMsg) {
                  assistantMsg.text += parsed.text;
                }
              }
            } else if (currentEvent === 'done') {
              // 스트리밍 완료
              break;
            }
          } catch {
            // JSON 파싱 실패 시 무시
          }
        }
      }
      await scrollToBottom();
    }

    // 스트리밍 완료 후 타이핑 인디케이터 숨기기
    isTyping.value = false;

    // 정책이 있으면 store에 저장하고 액션 버튼 추가
    if (policies.length > 0) {
      setPolicyData(policies, userProfile.value);

      messages.value.push({
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        text: '상세한 혜택 정보를 리포트로 정리해두었어요.',
        type: 'action',
        actionLabel: '결과 리포트 보기',
        actionLink: '/result',
      });
    }

  } catch (e) {
    isTyping.value = false;
    // 에러 메시지 추가
    const assistantMsg = messages.value.find(m => m.id === assistantMsgId);
    if (assistantMsg && !assistantMsg.text) {
      assistantMsg.text = '죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    } else if (!assistantMsg) {
      messages.value.push({
        id: assistantMsgId,
        role: 'assistant',
        text: '죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
    }
  }

  await scrollToBottom();

  // 응답 완료 후 입력창에 포커스
  await nextTick();
  chatInputRef.value?.focus();
};

const handleQuickReply = (option: string) => {
  sendMessage(option);
};

const handleAction = (link: string) => {
  router.push(link);
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="flex flex-col h-[100dvh] bg-gray-50">
    <!-- Header -->
    <header class="flex items-center px-4 py-3 bg-white border-b border-gray-100 shadow-sm z-10">
      <button @click="goBack" class="p-2 -ml-2 text-gray-600 rounded-full hover:bg-gray-100 active:scale-95">
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <h1 class="ml-2 text-lg font-bold text-gray-900">Benny Pick</h1>
    </header>

    <!-- Messages Area -->
    <main ref="messagesContainer" class="flex-1 px-4 py-6 overflow-y-auto scroll-smooth">
      <div class="flex flex-col max-w-4xl mx-auto">
        <ChatBubble
          v-for="msg in messages"
          :key="msg.id"
          :role="msg.role"
          :text="msg.text"
          :actionLabel="(msg as any).actionLabel"
          :actionLink="(msg as any).actionLink"
          @action="handleAction"
        />
        <ChatTyping v-if="isTyping" />
      </div>
    </main>

    <!-- Bottom Area (Quick Replies + Input) -->
    <div class="flex-shrink-0 bg-white border-t border-gray-100">
      <div class="max-w-4xl px-4 py-3 mx-auto space-y-3">
        <!-- Quick Replies -->
        <ChatQuickReplies
          v-if="!isTyping && quickReplies.length > 0"
          :options="quickReplies"
          @select="handleQuickReply"
        />
        
        <!-- Input -->
        <ChatInput
          ref="chatInputRef"
          v-model="userInput"
          :disabled="isTyping"
          @submit="() => sendMessage(userInput)"
        />
      </div>
    </div>
  </div>
</template>
