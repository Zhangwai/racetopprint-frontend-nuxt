<template>
  <div class="page-container">
    <!-- 页面内容 -->
    <div v-if="pageConfig" class="page-content">
      <!-- 页面加载状态 -->
      <div v-if="pageStore.isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>页面加载中...</p>
      </div>
      <!-- 组件渲染器 -->
      <component-renderer :components="pageConfig.components" />
    </div>

    <!-- 页面未找到 -->
    <div v-else class="not-found">
      <h2>❌ 页面未找到</h2>
      <p>抱歉，您访问的页面不存在或已被删除</p>
      <NuxtLink to="/" class="btn btn-primary">返回首页</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PageConfig } from '~/types/component-builder'
import { usePageStore } from '@/stores/pageStore'
import { useComponentRenderer } from '~/composables/useComponentRenderer'

const route = useRoute()
const pageSlug = (route.params.slug as string[])?.join('/') || ''

// 获取页面 Store
const pageStore = usePageStore()

// 初始化页面数据
if (process.server && pageStore.pages.length === 0) {
  await pageStore.initPages()
}

// 从 Store 中查找页面
const pageConfig = computed(() => {
  const page = pageStore.pages.find(
    (p) => p.slug === pageSlug && p.status === 'published'
  )
  console.log('Found page:', page)
  return page
})

// 设置页面标题
useHead({
  title: pageConfig.value?.title || '页面 - RaceTopprint',
  meta: [
    {
      name: 'description',
      content: pageConfig.value?.description || '欢迎来到 RaceTopprint',
    },
    {
      name: 'keywords',
      content: pageConfig.value?.keywords || '商城,购物,商品',
    },
  ],
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f7fafc;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 20px;
}

.loading-state p {
  font-size: 18px;
  color: #666;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 错误状态 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 20px;
  padding: 40px;
  text-align: center;
}

.error-state h2 {
  font-size: 32px;
  color: #e53e3e;
  margin: 0;
}

.error-state p {
  font-size: 18px;
  color: #666;
  margin: 0;
}

/* 未找到状态 */
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 20px;
  padding: 40px;
  text-align: center;
}

.not-found h2 {
  font-size: 32px;
  color: #e53e3e;
  margin: 0;
}

.not-found p {
  font-size: 18px;
  color: #666;
  margin: 0;
}

/* 页面内容 */
.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 按钮样式 */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #4299e1;
  color: white;
}

.btn-primary:hover {
  background: #2b6cb0;
}
</style>