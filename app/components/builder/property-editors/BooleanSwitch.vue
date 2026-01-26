<template>
  <div class="boolean-switch">
    <label class="switch-container">
      <span class="switch-label">{{ label }}</span>
      <label class="switch">
        <input :checked="modelValue" @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)" type="checkbox" :disabled="disabled" />
        <span class="slider" :class="{ checked: modelValue }"></span>
      </label>
      <span class="switch-status">{{ modelValue ? '开启' : '关闭' }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  label?: string
  disabled?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<style scoped>
.boolean-switch {
  display: flex;
  align-items: center;
  gap: 8px;
}

.switch-container {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.switch-label {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  cursor: pointer;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d1d5db;
  transition: 0.2s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.2s;
  border-radius: 50%;
}

.slider.checked {
  background-color: #4f46e5;
}

.slider.checked:before {
  transform: translateX(24px);
}

.switch-status {
  font-size: 12px;
  color: #6b7280;
  min-width: 40px;
}

.switch input:disabled + .slider {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>