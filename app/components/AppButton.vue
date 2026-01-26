<template>
  <button
    :class="[
      'app-button',
      `app-button--${variant}`,
      { 'app-button--disabled': disabled },
      { 'app-button--loading': loading }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="loading-spinner">⏳</span>
    <slot>{{ text }}</slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  text?: string
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  disabled?: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
}

.app-button--primary {
  background: #4299e1;
  color: white;
}

.app-button--primary:hover:not(:disabled) {
  background: #2b6cb0;
}

.app-button--secondary {
  background: #e2e8f0;
  color: #2d3748;
  border: 1px solid #cbd5e0;
}

.app-button--secondary:hover:not(:disabled) {
  background: #cbd5e0;
}

.app-button--success {
  background: #48bb78;
  color: white;
}

.app-button--success:hover:not(:disabled) {
  background: #38a169;
}

.app-button--danger {
  background: #f56565;
  color: white;
}

.app-button--danger:hover:not(:disabled) {
  background: #e53e3e;
}

.app-button--disabled,
.app-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.app-button--loading {
  cursor: progress;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>