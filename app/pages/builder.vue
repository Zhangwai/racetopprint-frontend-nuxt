<template>
  <div class="builder-container">
    <!-- 顶部导航栏 -->
    <div class="builder-header">
      <h1>页面编辑器</h1>
      <div class="header-actions">
        <button @click="savePage" class="btn btn-primary">
          💾 保存
        </button>
        <button @click="previewPage" class="btn btn-secondary">
          👁️ 预览
        </button>
        <button @click="publishPage" class="btn btn-success">
          🚀 发布
        </button>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="builder-main">
      <!-- 左侧：组件库 -->
      <div class="component-library">
        <h3>组件库</h3>
        
        <div class="category-tabs">
          <button
            v-for="category in categories"
            :key="category.value"
            class="category-tab"
            :class="{ active: currentCategory === category.value }"
            @click="currentCategory = category.value"
          >
            {{ category.label }}
          </button>
        </div>
        
        <div class="components-list">
          <div
            v-for="component in filteredComponents"
            :key="component.type"
            class="component-item"
            draggable="true"
            @dragstart="onDragStart($event, component)"
          >
            <span class="component-icon">{{ component.icon }}</span>
            <div class="component-info">
              <span class="component-name">{{ component.name }}</span>
              <span class="component-description">{{ component.description }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 中间：画布 -->
      <div class="canvas-area">
        <div class="canvas-header">
          <h3>页面画布</h3>
          <div class="canvas-actions">
            <button @click="undo" :disabled="historyIndex <= 0" class="btn btn-small">
              ↩️ 撤销
            </button>
            <button @click="redo" :disabled="historyIndex >= history.length - 1" class="btn btn-small">
              ↪️ 重做
            </button>
            <button @click="clearCanvas" class="btn btn-small btn-danger">
              🗑️ 清空
            </button>
          </div>
        </div>
        
        <div 
          class="canvas"
          @dragover.prevent
          @drop="onDrop"
        >
          <div
            v-for="(component, index) in pageComponents"
            :key="component.id"
            class="canvas-component"
            :class="{ selected: selectedComponentId === component.id }"
            @click="selectComponent(component.id)"
            draggable="true"
            @dragstart="onComponentDragStart($event, index)"
            @dragover.prevent="onComponentDragOver($event, index)"
            @drop="onComponentDrop($event, index)"
          >
            <BuilderComponentRenderer :components="[component]" />
            <div class="component-handle">
              <span class="drag-icon">⋮⋮</span>
              <button @click.stop="deleteComponent(component.id)">🗑️</button>
            </div>
          </div>
          
          <div v-if="pageComponents.length === 0" class="empty-canvas">
            <p>从左侧拖拽组件到这里开始构建页面</p>
          </div>
        </div>
      </div>
      
      <!-- 右侧：属性编辑器 -->
      <BuilderPropertyEditor :selected-component="selectedComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComponentConfig, ComponentDefinition, PageConfig } from '~/types/component-builder'
import { getComponentDefinitions } from '~/composables/useComponentRegistry'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const pageManager = usePageManager()

const categories = [
  { value: 'all', label: '全部' },
  { value: 'content', label: '内容' },
  { value: 'product', label: '商品' },
  { value: 'promotion', label: '促销' },
  { value: 'navigation', label: '导航' }
]

const currentCategory = ref('all')
const currentPageId = ref<string | null>(null)
const currentPage = ref<PageConfig | null>(null)
const pageComponents = ref<ComponentConfig[]>([])

const components: ComponentDefinition[] = getComponentDefinitions()

const filteredComponents = computed(() => {
  if (currentCategory.value === 'all') {
    return components
  }
  return components.filter(c => c.category === currentCategory.value)
})

// 加载页面
const loadCurrentPage = async () => {
  const pageId = route.query.pageId as string
  if (pageId) {
    currentPageId.value = pageId
    const page = await pageManager.loadPage(pageId)
    if (page) {
      currentPage.value = page
      // 加载页面组件
      pageComponents.value = page.components.map(c => ({
        ...c,
        id: c.id || generateId()
      }))
      saveToHistory()
    }
  }
}

// 保存页面
const saveCurrentPage = async () => {
  if (currentPageId.value && currentPage.value) {
    try {
      await pageManager.savePage(currentPageId.value, {
        ...currentPage.value,
        components: pageComponents.value
      })
      alert('页面已保存！')
    } catch (error) {
      console.error('Failed to save page:', error)
      alert('保存页面失败！')
    }
  }
}

// 发布页面
const publishCurrentPage = async () => {
  if (currentPageId.value) {
    try {
      await pageManager.publishPage(currentPageId.value)
      alert('页面已发布！')
    } catch (error) {
      console.error('Failed to publish page:', error)
      alert('发布页面失败！')
    }
  }
}

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

onMounted(() => {
  loadCurrentPage()
})

// 使用当前页面配置代替默认配置
const selectedComponentId = ref<string | null>(null)
const selectedComponent = computed(() => {
  return pageComponents.value.find(c => c.id === selectedComponentId.value) || null
})

const history = ref<ComponentConfig[][]>([[]])
const historyIndex = ref(0)

const saveToHistory = () => {
  const newHistory = history.value.slice(0, historyIndex.value + 1)
  newHistory.push(JSON.parse(JSON.stringify(pageComponents.value)))
  history.value = newHistory
  historyIndex.value = newHistory.length - 1
}

const undo = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--
    pageComponents.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
  }
}

const redo = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    pageComponents.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
  }
}

const draggedComponentType = ref<string | null>(null)
const draggedComponentProps = ref<Record<string, any> | null>(null)

const onDragStart = (event: DragEvent, component: ComponentDefinition) => {
  draggedComponentType.value = component.type
  draggedComponentProps.value = { ...component.defaultProps }
  
  event.dataTransfer?.setData('componentType', component.type)
  event.dataTransfer?.setData('componentProps', JSON.stringify(component.defaultProps))
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  
  const componentType = event.dataTransfer?.getData('componentType')
  const componentProps = event.dataTransfer?.getData('componentProps')
  
  console.log('onDrop - componentType:', componentType)
  console.log('onDrop - componentProps:', componentProps)
  
  if (componentType && componentProps) {
    try {
      const props = JSON.parse(componentProps)
      console.log('onDrop - parsed props:', props)
      
      const newComponent: ComponentConfig = {
        id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: componentType,
        props: props,
        position: pageComponents.value.length,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      console.log('onDrop - newComponent:', newComponent)
      pageComponents.value.push(newComponent)
      console.log('onDrop - components after push:', pageComponents.value)
      saveToHistory()
      console.log('onDrop - history saved')
    } catch (error) {
      console.error('onDrop - error:', error)
    }
  }
  
  draggedComponentType.value = null
}

const selectComponent = (componentId: string) => {
  selectedComponentId.value = componentId
}

const deleteComponent = (componentId: string) => {
  const index = pageComponents.value.findIndex(c => c.id === componentId)
  if (index !== -1) {
    pageComponents.value.splice(index, 1)
    if (selectedComponentId.value === componentId) {
      selectedComponentId.value = null
    }
    saveToHistory()
  }
}

const draggedComponentIndex = ref<number | null>(null)

const onComponentDragStart = (event: DragEvent, index: number) => {
  draggedComponentIndex.value = index
}

const onComponentDragOver = (event: DragEvent, index: number) => {
  event.preventDefault()
}

const onComponentDrop = (event: DragEvent, index: number) => {
  event.preventDefault()
  
  // Check if this is a new component from the library
  const componentType = event.dataTransfer?.getData('componentType');
  const componentProps = event.dataTransfer?.getData('componentProps');
  
  if (componentType && componentProps) {
    // Add new component at this index
    const newComponent: ComponentConfig = {
      id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: componentType,
      props: JSON.parse(componentProps),
      position: index,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    pageComponents.value.splice(index, 0, newComponent);
    saveToHistory();
  } else if (draggedComponentIndex.value !== null && draggedComponentIndex.value !== index) {
    // Reorder existing component
    const component = pageComponents.value.splice(draggedComponentIndex.value, 1)[0];
    pageComponents.value.splice(index, 0, component);
    saveToHistory();
  }
  
  draggedComponentIndex.value = null;
}

const clearCanvas = () => {
  if (confirm('确定要清空画布吗？')) {
    pageComponents.value = []
    selectedComponentId.value = null
    saveToHistory()
  }
}

const savePage = () => {
  saveCurrentPage()
}

const previewPage = () => {
  if (currentPage.value) {
    window.open(`/preview/${currentPage.value.slug}`, '_blank')
  } else {
    alert('请先保存页面！')
  }
}

const publishPage = () => {
  publishCurrentPage()
}
</script>

<style scoped>
.builder-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f3f4f6;
}

.builder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.builder-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background-color: #4338ca;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #5b6270;
}

.btn-success {
  background-color: #10b981;
  color: white;
}

.btn-success:hover {
  background-color: #059669;
}

.btn-small {
  padding: 6px 12px;
  font-size: 13px;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.builder-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.component-library {
  width: 300px;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  padding: 20px;
}

.component-library h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.category-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.category-tab {
  padding: 6px 12px;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.category-tab:hover {
  background-color: #e5e7eb;
}

.category-tab.active {
  background-color: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.components-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.component-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s;
}

.component-item:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.component-item:active {
  cursor: grabbing;
}

.component-icon {
  font-size: 28px;
}

.component-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.component-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.component-description {
  font-size: 12px;
  color: #6b7280;
}

.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  overflow: hidden;
}

.canvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.canvas-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.canvas-actions {
  display: flex;
  gap: 8px;
}

.canvas {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #f3f4f6;
}

.canvas-component {
  position: relative;
  background-color: white;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s;
}

.canvas-component:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.canvas-component.selected {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.component-handle {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.canvas-component:hover .component-handle {
  opacity: 1;
}

.drag-icon {
  cursor: grab;
  padding: 4px 8px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 4px;
  font-size: 12px;
}

.drag-icon:active {
  cursor: grabbing;
}

.empty-canvas {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  background-color: white;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  color: #9ca3af;
  font-size: 16px;
}
</style>