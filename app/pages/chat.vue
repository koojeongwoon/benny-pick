<script setup lang="ts">
interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  type?: 'text' | 'card'; // Future proofing for cards
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

  // Call Real API
  isTyping.value = true;
  await scrollToBottom();

  try {
    const { data, error } = await useFetch('/api/chat', {
      method: 'POST',
      body: {
        messages: messages.value.map(m => ({ role: m.role, text: m.text }))
      }
    });

    if (error.value) {
      throw new Error('API Error');
    }

    const response = data.value as any;

    isTyping.value = false;
    messages.value.push({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: response.reply,
    });
    
    // Save data to store
    if (response.policies && response.policies.length > 0) {
      setPolicyData(response.policies, response.intent);
      
      // Add a "System" message with a button (simulated as assistant message for now, or a new type)
      // For MVP, let's append a special message or just a button in the chat stream?
      // Let's use a cleaner approach: Append a message that triggers a UI element.
      // Actually, let's just add a "View Results" action bubble.
      messages.value.push({
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        text: '상세한 혜택 정보를 리포트로 정리해두었어요.',
        type: 'action', // Custom type for action button
        actionLabel: '결과 리포트 보기',
        actionLink: '/result'
      } as any);
    }
    
  } catch (e) {
    isTyping.value = false;
    messages.value.push({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: '죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    });
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
