<template>
  <div :class="['app-alert', `app-alert--${variant}`]" v-if="show">
    <div class="app-alert__content">
      <span class="app-alert__icon">{{ icon }}</span>
      <div class="app-alert__message">
        <slot>{{ message }}</slot>
      </div>
    </div>
    <button v-if="closable" class="app-alert__close" @click="handleClose">
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  message?: string
  variant?: 'info' | 'success' | 'warning' | 'error'
  closable?: boolean
  modelValue?: boolean
  duration?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const show = ref(props.modelValue ?? true)

watch(() => props.modelValue, (newVal) => {
  show.value = newVal ?? true
})

const icon = computed(() => {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  }
  return icons[props.variant ?? 'info']
})

const handleClose = () => {
  show.value = false
  emit('update:modelValue', false)
  emit('close')
}

if (props.duration && props.duration > 0) {
  setTimeout(() => {
    handleClose()
  }, props.duration)
}
</script>

<style scoped>
.app-alert {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border-left: 4px solid currentColor;
}

.app-alert--info {
  background: #ebf8ff;
  color: #2c5282;
}

.app-alert--success {
  background: #f0fff4;
  color: #22543d;
}

.app-alert--warning {
  background: #fffbeb;
  color: #744210;
}

.app-alert--error {
  background: #fed7d7;
  color: #742a2a;
}

.app-alert__content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.app-alert__icon {
  font-size: 1.25rem;
}

.app-alert__message {
  color: inherit;
  font-size: 0.9rem;
}

.app-alert__close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.3s;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-alert__close:hover {
  opacity: 1;
}
</style>