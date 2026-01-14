<script setup lang="ts">
import { marked } from 'marked';

const props = defineProps<{
  role: 'user' | 'assistant';
  text?: string;
  actionLabel?: string;
  actionLink?: string;
}>();

const emit = defineEmits(['action']);

// 마크다운 렌더링 (assistant만)
const renderedText = computed(() => {
  if (!props.text) return '';
  if (props.role === 'user') return props.text;

  // marked 옵션 설정
  marked.setOptions({
    breaks: true, // 줄바꿈을 <br>로 변환
    gfm: true,    // GitHub Flavored Markdown
  });

  return marked.parse(props.text);
});

const handleActionClick = () => {
  if (props.actionLink) {
    emit('action', props.actionLink);
  }
};
</script>

<template>
  <div
    class="flex w-full mb-4 animate-fade-in-up items-start gap-2"
    :class="role === 'user' ? 'justify-end' : 'justify-start'"
  >
    <!-- Assistant Avatar -->
    <div v-if="role === 'assistant'" class="flex-shrink-0 mr-1">
      <div class="p-0.5 bg-white rounded-full shadow-sm border border-gray-100">
        <img 
          src="/benny_pick_profile.png" 
          alt="Benny Pick" 
          class="w-11 h-11 rounded-full object-cover"
        />
      </div>
    </div>

    <div
      class="max-w-[80%] p-4 rounded-2xl shadow-sm animate-fade-in-up"
      :class="[
        role === 'user'
          ? 'bg-primary text-white rounded-tr-none'
          : 'bg-white text-gray-800 rounded-tl-none border border-gray-100',
      ]"
    >
      <!-- User: 일반 텍스트, Assistant: 마크다운 렌더링 -->
      <p v-if="role === 'user'" class="whitespace-pre-wrap leading-relaxed">{{ text }}</p>
      <div
        v-else
        class="prose prose-sm max-w-none prose-headings:text-gray-800 prose-headings:font-bold prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2 prose-p:my-1 prose-ul:my-2 prose-li:my-0 prose-strong:text-primary"
        v-html="renderedText"
      ></div>
      
      <!-- Action Button (if present) -->
      <div v-if="props.actionLabel" class="mt-3 pt-3 border-t border-gray-100/20">
        <button 
          @click="handleActionClick"
          class="w-full py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-1"
          :class="role === 'user' ? 'text-white' : 'text-primary bg-blue-50 hover:bg-blue-100'"
        >
          <span>{{ props.actionLabel }}</span>
          <span class="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
