<template>
  <div class="string-input">
    <label v-if="label">{{ label }}</label>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="text"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
    />
    <span v-if="maxlength" class="char-count">{{ modelValue?.length || 0 }}/{{ maxlength }}</span>
  </div>
</template>

<script setup lang="ts">
import type { PropertySchema } from '~/types/component-builder'

defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  disabled?: boolean
  maxlength?: number
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
.string-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.string-input label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.string-input input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

.string-input input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.string-input input:disabled {
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