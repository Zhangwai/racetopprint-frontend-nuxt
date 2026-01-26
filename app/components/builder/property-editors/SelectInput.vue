<template>
  <div class="select-input">
    <label v-if="label">{{ label }}</label>
    <select :value="modelValue" @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)" :disabled="disabled">
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string | number
  label?: string
  placeholder?: string
  disabled?: boolean
  options: Array<{ value: string | number; label: string }>
}>()

defineEmits<{
  'update:modelValue': [value: string | number]
}>()
</script>

<style scoped>
.select-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.select-input label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.select-input select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.select-input select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.select-input select:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.select-input option {
  padding: 8px;
}
</style>