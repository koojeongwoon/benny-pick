<script setup lang="ts">
const props = defineProps<{
  role: 'user' | 'assistant';
  text?: string;
  actionLabel?: string;
  actionLink?: string;
}>();

const emit = defineEmits(['action']);

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
      <p class="whitespace-pre-wrap leading-relaxed">{{ text }}</p>
      
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
