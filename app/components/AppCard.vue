<template>
  <div :class="['app-card', { 'app-card--hover': hover }]">
    <div v-if="title" class="app-card__header">
      <h3 class="app-card__title">{{ title }}</h3>
    </div>
    <div class="app-card__content">
      <slot />
    </div>
    <div v-if="$slots.footer" class="app-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  hover?: boolean
}>()
</script>

<style scoped>
.app-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s;
}

.app-card--hover {
  cursor: pointer;
}

.app-card--hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.app-card__header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f7fafc;
}

.app-card__title {
  margin: 0;
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 600;
}

.app-card__content {
  padding: 1.5rem;
}

.app-card__footer {
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f7fafc;
}
</style>