<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'submit'): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleSubmit = () => {
  if (!props.modelValue.trim() || props.disabled) return;
  emit('submit');
};

// Auto-focus on mount
onMounted(() => {
  inputRef.value?.focus();
});
</script>

<template>
  <div class="relative flex items-center w-full p-2 bg-white border border-gray-200 shadow-lg rounded-3xl">
    <input
      ref="inputRef"
      :value="modelValue"
      @input="handleInput"
      @keydown.enter.prevent="handleSubmit"
      :disabled="disabled"
      type="text"
      placeholder="궁금한 점을 물어보세요..."
      class="flex-1 px-4 py-2 text-base bg-transparent border-none outline-none placeholder-gray-400 focus:ring-0 disabled:opacity-50"
    />
    <button
      @click="handleSubmit"
      :disabled="!modelValue.trim() || disabled"
      class="flex items-center justify-center w-10 h-10 ml-2 text-white transition-all duration-200 rounded-full bg-primary hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-90"
    >
      <span class="material-symbols-outlined text-[20px]">arrow_upward</span>
    </button>
  </div>
</template>
