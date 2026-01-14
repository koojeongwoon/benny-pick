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

const messagesContainer = ref<HTMLElement | null>(null);

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

  // 스트리밍 응답을 위한 assistant 메시지 미리 추가
  const assistantMsgId = (Date.now() + 1).toString();
  messages.value.push({
    id: assistantMsgId,
    role: 'assistant',
    text: '',
  });

  let policies: PolicySource[] = [];

  try {
    const response = await fetch('http://localhost:8000/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: text,
        top_k: 5,
      }),
    });

    if (!response.ok) {
      throw new Error('API Error');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No reader available');
    }

    isTyping.value = false;
    let buffer = '';
    let currentEvent = '';

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
            if (currentEvent === 'sources') {
              // sources 이벤트: 정책 배열
              policies = JSON.parse(data);
            } else if (currentEvent === 'answer') {
              // answer 이벤트: {"text": "..."} 형태
              const parsed = JSON.parse(data);
              if (parsed.text !== undefined) {
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

    // 정책이 있으면 store에 저장하고 액션 버튼 추가
    if (policies.length > 0) {
      setPolicyData(policies, {});

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
    // 빈 메시지였으면 에러 메시지로 교체
    const assistantMsg = messages.value.find(m => m.id === assistantMsgId);
    if (assistantMsg && !assistantMsg.text) {
      assistantMsg.text = '죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
  }

  await scrollToBottom();
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
      <div class="flex flex-col max-w-2xl mx-auto">
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
      <div class="max-w-2xl px-4 py-3 mx-auto space-y-3">
        <!-- Quick Replies -->
        <ChatQuickReplies
          v-if="!isTyping && quickReplies.length > 0"
          :options="quickReplies"
          @select="handleQuickReply"
        />
        
        <!-- Input -->
        <ChatInput
          v-model="userInput"
          :disabled="isTyping"
          @submit="() => sendMessage(userInput)"
        />
      </div>
    </div>
  </div>
</template>
