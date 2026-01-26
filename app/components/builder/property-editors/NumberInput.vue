<template>
  <div class="number-input">
    <label v-if="label">{{ label }}</label>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
      type="number"
      :min="min"
      :max="max"
      :step="step"
      :placeholder="placeholder"
      :disabled="disabled"
    />
    <div class="range-info">
      <span v-if="min">最小值: {{ min }}</span>
      <span v-if="max">最大值: {{ max }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: number
  label?: string
  placeholder?: string
  disabled?: boolean
  min?: number
  max?: number
  step?: number
}>()

defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<style scoped>
.number-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.number-input label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.number-input input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

.number-input input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.number-input input:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.range-info {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
}
</style>