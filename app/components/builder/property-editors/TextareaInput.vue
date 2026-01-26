<template>
  <div class="textarea-input">
    <label v-if="label">{{ label }}</label>
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
    ></textarea>
    <span v-if="maxlength" class="char-count">{{ modelValue?.length || 0 }}/{{ maxlength }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  disabled?: boolean
  rows?: number
  maxlength?: number
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
.textarea-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.textarea-input label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.textarea-input textarea {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s;
}

.textarea-input textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.textarea-input textarea:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.char-count {
  font-size: 12px;
  color: #6b7280;
  text-align: right;
}
</style>