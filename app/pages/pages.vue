<template>
  <div class="page-manager">
    <!-- 顶部导航 -->
    <div class="page-manager-header">
      <h1>页面管理</h1>
      <button @click="showCreateModal = true" class="btn btn-primary">
        ➕ 创建页面
      </button>
    </div>
    <!-- 页面内容区域 -->
    <div class="page-content">
      <!-- 页面列表 -->
      <div v-if="!isLoading" class="page-list">
        <div v-for="page in activePages" :key="page.id" class="page-card" :class="`status-${page.status}`">
          <div class="page-info">
            <div class="page-header">
              <h3>{{ page.name }}</h3>
              <span class="page-status">{{ getStatusText(page.status) }}</span>
            </div>
            <p class="page-slug">/{{ page.slug }}</p>
            <p class="page-description">{{ page.description }}</p>
            <div class="page-meta">
              <span class="meta-item">📅 {{ formatDate(page.updatedAt) }}</span>
              <span v-if="page.publishedAt" class="meta-item">🚀 {{ formatDate(page.publishedAt) }}</span>
            </div>
          </div>

          <div class="page-actions">
            <button @click="editPage(page.id)" class="btn btn-secondary">
              ✏️ 编辑
            </button>
            <button v-if="page.status !== 'published'" @click="publishPage(page.id)" class="btn btn-success">
              🚀 发布
            </button>
            <button v-else @click="unpublishPage(page.id)" class="btn btn-warning">
              ⏸️ 取消发布
            </button>
            <button @click="archivePage(page.id)" class="btn btn-danger">
              🗑️ 删除
            </button>
          </div>
        </div>

        <div v-if="activePages.length === 0" class="empty-state">
          <p>暂无页面</p>
          <button @click="showCreateModal = true" class="btn btn-primary">
            ➕ 创建第一个页面
          </button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-else class="loading-state">
        <p>加载中...</p>
      </div>
    </div>

    <!-- 创建页面弹窗 -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal">
        <div class="modal-header">
          <h2>创建新页面</h2>
          <button @click="showCreateModal = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>页面名称 *</label>
            <input v-model="newPage.name" type="text" placeholder="例如: 首页" class="form-input" />
          </div>
          <div class="form-group">
            <label>页面路径 *</label>
            <div class="input-group">
              <span class="input-prefix">/</span>
              <input v-model="newPage.slug" type="text" placeholder="例如: home" class="form-input" />
            </div>
          </div>
          <div class="form-group">
            <label>页面标题 *</label>
            <input v-model="newPage.title" type="text" placeholder="例如: 我的商城 - 首页" class="form-input" />
          </div>
          <div class="form-group">
            <label>页面描述</label>
            <textarea v-model="newPage.description" placeholder="输入页面描述" rows="3" class="form-textarea"></textarea>
          </div>
          <div class="form-group">
            <label>页面关键词</label>
            <input v-model="newPage.keywords" type="text" placeholder="例如: 商城,购物,商品" class="form-input" />
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showCreateModal = false" class="btn btn-secondary">
            取消
          </button>
          <button @click="handleCreatePage" class="btn btn-primary" :disabled="!canCreatePage">
            创建页面
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePageManager } from '~/composables/usePageManager'

const router = useRouter()
const pageManager = usePageManager()

// 使用 toRef 保持响应式引用
const isLoading = computed(() => pageManager.isLoading.value)
const activePages = computed(() => pageManager.activePages.value)

const showCreateModal = ref(false)
const newPage = ref({
  name: '',
  slug: '',
  title: '',
  description: '',
  keywords: ''
})

const canCreatePage = computed(() => {
  return newPage.value.name.trim() &&
    newPage.value.slug.trim() &&
    newPage.value.title.trim()
})

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'draft': '草稿',
    'published': '已发布',
    'archived': '已归档'
  }
  return statusMap[status] || status
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const editPage = (pageId: string) => {
  router.push(`/builder?pageId=${pageId}`)
}

const publishPage = async (pageId: string) => {
  try {
    await pageManager.publishPage(pageId)
    alert('页面已发布！')
  } catch (error) {
    console.error('Failed to publish page:', error)
    alert('发布页面失败！')
  }
}

const unpublishPage = async (pageId: string) => {
  try {
    await pageManager.unpublishPage(pageId)
    alert('页面已取消发布！')
  } catch (error) {
    console.error('Failed to unpublish page:', error)
    alert('取消发布页面失败！')
  }
}

const archivePage = async (pageId: string) => {
  if (!confirm('确定要删除这个页面吗？删除后可以在归档列表中恢复。')) {
    return
  }
  try {
    await pageManager.archivePage(pageId)
    alert('页面已删除！')
  } catch (error) {
    console.error('Failed to archive page:', error)
    alert('删除页面失败！')
  }
}

const handleCreatePage = async () => {
  try {
    await pageManager.createPage({
      name: newPage.value.name,
      slug: newPage.value.slug,
      title: newPage.value.title,
      description: newPage.value.description,
      keywords: newPage.value.keywords
    })

    showCreateModal.value = false
    newPage.value = {
      name: '',
      slug: '',
      title: '',
      description: '',
      keywords: ''
    }

    alert('页面创建成功！')
  } catch (error) {
    console.error('Failed to create page:', error)
    alert('创建页面失败！')
  }
}

onMounted(() => {
  pageManager.initPages()
})
</script>

<style scoped>
.page-manager {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-manager-header h1 {
  margin: 0;
  font-size: 28px;
  color: #1f2937;
}

.page-list {
  display: grid;
  gap: 20px;
}

.page-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  transition: all 0.3s;
}

.page-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.page-card.status-draft {
  border-left: 4px solid #f59e0b;
}

.page-card.status-published {
  border-left: 4px solid #10b981;
}

.page-card.status-archived {
  border-left: 4px solid #ef4444;
  opacity: 0.6;
}

.page-info {
  flex: 1;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.page-header h3 {
  margin: 0;
  font-size: 20px;
  color: #1f2937;
}

.page-status {
  background: #f3f4f6;
  color: #374151;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.page-card.status-published .page-status {
  background: #d1fae5;
  color: #065f46;
}

.page-card.status-draft .page-status {
  background: #fef3c7;
  color: #92400e;
}

.page-card.status-archived .page-status {
  background: #fee2e2;
  color: #991b1b;
}

.page-slug {
  margin: 0 0 8px 0;
  color: #6b7280;
  font-size: 14px;
  font-family: 'Courier New', monospace;
}

.page-description {
  margin: 0 0 12px 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
}

.page-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #9ca3af;
}

.page-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background: #4338ca;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

.btn-warning {
  background: #f59e0b;
  color: white;
}

.btn-warning:hover {
  background: #d97706;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
}

.empty-state p {
  margin: 0 0 20px 0;
  color: #6b7280;
  font-size: 16px;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
  font-size: 16px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.input-group {
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
}

.input-group:focus-within {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.input-prefix {
  background: #f3f4f6;
  padding: 12px 16px;
  color: #6b7280;
  font-family: 'Courier New', monospace;
  border-right: 1px solid #d1d5db;
}

.input-group .form-input {
  border: none;
  box-shadow: none;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
}
</style>