# 🛍️ 电商组件装修系统 - 详细设计方案

## 📋 目录

1. [整体架构设计](#整体架构设计)
2. [C端组件化系统（SSR）](#c端组件化系统ssr)
3. [管理后台拖拽编辑系统（CSR SPA）](#管理后台拖拽编辑系统csr-spa)
4. [组件配置系统](#组件配置系统)
5. [组件渲染引擎](#组件渲染引擎)
6. [拖拽交互系统](#拖拽交互系统)
7. [组件属性编辑器](#组件属性编辑器)
8. [页面保存和发布](#页面保存和发布)
9. [组件库设计](#组件库设计)
10. [数据模型设计](#数据模型设计)
11. [技术栈选择](#技术栈选择)
12. [文件结构](#文件结构)

---

## 🎯 整体架构设计

### 1.1 系统架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        Nuxt 4 应用                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐    ┌──────────────────────────────────┐  │
│  │   C端页面 (SSR)   │    │   管理后台 (CSR SPA)              │  │
│  │                  │    │                                  │  │
│  │  - 首页          │    │  - 组件库                       │  │
│  │  - 活动页        │    │  - 画布区域                     │  │
│  │  - 商品页        │    │  - 属性编辑器                   │  │
│  │                  │    │  - 页面配置                     │  │
│  └────────┬─────────┘    └────────────────┬─────────────────┘  │
│           │                               │                      │
│           ▼                               ▼                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              组件渲染引擎 (Component Render Engine)       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              组件配置系统 (Component Config System)       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              组件库 (Component Library)                   │   │
│  │  - 轮播图组件                                              │   │
│  │  - 商品列表组件                                            │   │
│  │  - 导航栏组件                                              │   │
│  │  - 广告位组件                                              │   │
│  │  - 活动卡片组件                                            │   │
│  │  - 自定义HTML组件                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API 层                                   │
├─────────────────────────────────────────────────────────────────┤
│  - /api/pages (页面 CRUD)                                       │
│  - /api/components (组件配置)                                   │
│  - /api/component-library (组件库管理)                          │
│  - /api/templates (模板管理)                                    │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 核心设计原则

1. **组件化设计**
   - 每个组件都是独立的 Vue 组件
   - 组件支持配置化（props）
   - 组件支持自定义样式

2. **配置驱动**
   - 页面由 JSON 配置驱动
   - 配置包含组件列表、顺序、属性
   - 配置支持版本管理

3. **渲染引擎**
   - 统一的组件渲染引擎
   - 支持 SSR 和 CSR 渲染
   - 支持动态组件加载

4. **拖拽编辑**
   - 可视化拖拽界面
   - 实时预览
   - 所见即所得

---

## 🖥️ C端组件化系统（SSR）

### 2.1 设计目标

- ✅ 支持 SSR 渲染，提升 SEO 和首屏加载速度
- ✅ 支持动态组件配置
- ✅ 高性能，支持大量组件
- ✅ 响应式设计，支持多端适配
- ✅ 缓存优化，减少重复渲染

### 2.2 实现方案

#### 2.2.1 页面路由设计

```typescript
// app/pages/[pageSlug].vue
// 动态路由，根据页面 slug 加载配置

// 示例：
// - /home → 首页配置
// - /sale/new-year → 新年活动页
// - /product/123 → 商品详情页（混合模式）
```

#### 2.2.2 页面组件结构

```vue
<template>
  <div class="page-container">
    <component-renderer :components="pageConfig.components" />
  </div>
</template>

<script setup lang="ts">
import type { PageConfig, ComponentConfig } from '~/types/component-builder'

const route = useRoute()
const pageSlug = route.params.pageSlug as string

// SSR 预取页面配置
const { data: pageConfig } = await useFetch<PageConfig>(
  `/api/pages/${pageSlug}`,
  {
    server: true,
    transform: (response) => response.data
  }
)
</script>
```

#### 2.2.3 组件渲染器

```vue
<!-- app/components/ComponentRenderer.vue -->
<template>
  <div class="component-renderer">
    <component
      v-for="component in components"
      :key="component.id"
      :is="getComponent(component.type)"
      v-bind="component.props"
      :component-config="component"
    />
  </div>
</template>

<script setup lang="ts">
import type { ComponentConfig } from '~/types/component-builder'

const props = defineProps<{
  components: ComponentConfig[]
}>()

// 组件映射表
const componentMap = {
  'carousel': () => import('~/components/builder/Carousel.vue'),
  'product-list': () => import('~/components/builder/ProductList.vue'),
  'navigation': () => import('~/components/builder/Navigation.vue'),
  'banner': () => import('~/components/builder/Banner.vue'),
  'activity-card': () => import('~/components/builder/ActivityCard.vue'),
  'custom-html': () => import('~/components/builder/CustomHtml.vue'),
  'product-card': () => import('~/components/builder/ProductCard.vue'),
  'tab-nav': () => import('~/components/builder/TabNav.vue'),
  'footer': () => import('~/components/builder/Footer.vue')
}

// 动态加载组件
const getComponent = async (type: string) => {
  const loader = componentMap[type]
  if (!loader) {
    console.warn(`Component type "${type}" not found`)
    return () => null
  }
  return (await loader()).default
}
</script>
```

#### 2.2.4 缓存策略

```typescript
// 使用 Nuxt 的缓存机制
const { data: pageConfig } = await useFetch<PageConfig>(
  `/api/pages/${pageSlug}`,
  {
    server: true,
    cache: {
      maxAge: 60 * 60, // 缓存 1 小时
      swr: true // 后台重新验证
    }
  }
)
```

---

## 🎨 管理后台拖拽编辑系统（CSR SPA）

### 3.1 设计目标

- ✅ 纯 CSR 渲染，提供流畅的交互体验
- ✅ 拖拽式组件编辑
- ✅ 实时预览
- ✅ 组件属性可视化编辑
- ✅ 支持撤销/重做
- ✅ 支持模板保存和复用

### 3.2 实现方案

#### 3.2.1 页面布局

```vue
<!-- app/pages/admin/builder.vue -->
<template>
  <div class="builder-container">
    <!-- 左侧：组件库 -->
    <component-library @drag-start="onDragStart" />
    
    <!-- 中间：画布区域 -->
    <canvas-area 
      :components="pageConfig.components" 
      @drop="onDrop"
      @component-select="onComponentSelect"
      @component-move="onComponentMove"
      @component-delete="onComponentDelete"
    />
    
    <!-- 右侧：属性编辑器 -->
    <property-editor 
      v-if="selectedComponent"
      :component="selectedComponent"
      @update="onPropertyUpdate"
    />
    
    <!-- 顶部：工具栏 -->
    <toolbar 
      :page-config="pageConfig"
      @save="onSave"
      @publish="onPublish"
      @undo="onUndo"
      @redo="onRedo"
      @preview="onPreview"
    />
  </div>
</template>

<script setup lang="ts">
// 页面配置状态
const pageConfig = ref<PageConfig>({
  id: '',
  name: '',
  slug: '',
  components: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

// 选中的组件
const selectedComponent = ref<ComponentConfig | null>(null)

// 拖拽状态
const dragState = ref<{
  componentType: string
  componentProps: Record<string, any>
} | null>(null)

// 历史记录（用于撤销/重做）
const history = ref<PageConfig[]>([])
const historyIndex = ref(-1)

// 方法实现
const onDragStart = (componentType: string, props: Record<string, any>) => {
  dragState.value = { componentType, componentProps: props }
}

const onDrop = (position: number) => {
  if (!dragState.value) return
  
  const newComponent: ComponentConfig = {
    id: `component-${Date.now()}`,
    type: dragState.value.componentType,
    props: { ...dragState.value.componentProps },
    position: position,
    createdAt: new Date()
  }
  
  pageConfig.value.components.splice(position, 0, newComponent)
  saveToHistory()
}

const onComponentSelect = (component: ComponentConfig) => {
  selectedComponent.value = component
}

const onComponentMove = (fromIndex: number, toIndex: number) => {
  const component = pageConfig.value.components.splice(fromIndex, 1)[0]
  pageConfig.value.components.splice(toIndex, 0, component)
  saveToHistory()
}

const onComponentDelete = (componentId: string) => {
  const index = pageConfig.value.components.findIndex(c => c.id === componentId)
  if (index !== -1) {
    pageConfig.value.components.splice(index, 1)
    saveToHistory()
  }
}

const onPropertyUpdate = (componentId: string, properties: Record<string, any>) => {
  const component = pageConfig.value.components.find(c => c.id === componentId)
  if (component) {
    component.props = { ...component.props, ...properties }
    saveToHistory()
  }
}

const saveToHistory = () => {
  // 保存当前配置到历史记录
  const configCopy = JSON.parse(JSON.stringify(pageConfig.value))
  history.value = history.value.slice(0, historyIndex.value + 1)
  history.value.push(configCopy)
  historyIndex.value = history.value.length - 1
}

const onUndo = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--
    pageConfig.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
  }
}

const onRedo = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    pageConfig.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
  }
}

const onSave = async () => {
  await $fetch('/api/pages', {
    method: 'POST',
    body: pageConfig.value
  })
}

const onPublish = async () => {
  await $fetch('/api/pages/publish', {
    method: 'POST',
    body: { pageId: pageConfig.value.id }
  })
}
</script>
```

#### 3.2.2 组件库组件

```vue
<!-- app/components/admin/ComponentLibrary.vue -->
<template>
  <div class="component-library">
    <h3>组件库</h3>
    <div class="component-list">
      <div
        v-for="component in components"
        :key="component.type"
        class="component-item"
        draggable="true"
        @dragstart="onDragStart(component)"
      >
        <component-preview :component="component" />
        <span>{{ component.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComponentDefinition } from '~/types/component-builder'

const emit = defineEmits<{
  (e: 'drag-start', componentType: string, props: Record<string, any>): void
}>()

// 可用组件列表
const components: ComponentDefinition[] = [
  {
    type: 'carousel',
    name: '轮播图',
    icon: '🎠',
    description: '图片轮播组件',
    defaultProps: {
      images: [],
      autoplay: true,
      interval: 3000,
      showIndicators: true
    }
  },
  {
    type: 'product-list',
    name: '商品列表',
    icon: '📦',
    description: '商品展示列表',
    defaultProps: {
      category: 'all',
      limit: 8,
      layout: 'grid',
      showPrice: true,
      showDiscount: true
    }
  },
  {
    type: 'navigation',
    name: '导航栏',
    icon: '🧭',
    description: '顶部导航栏',
    defaultProps: {
      menus: [],
      backgroundColor: '#ffffff',
      textColor: '#333333'
    }
  },
  {
    type: 'banner',
    name: '广告位',
    icon: '📢',
    description: '广告横幅',
    defaultProps: {
      image: '',
      link: '',
      title: '',
      subtitle: ''
    }
  },
  {
    type: 'activity-card',
    name: '活动卡片',
    icon: '🎉',
    description: '活动展示卡片',
    defaultProps: {
      title: '',
      subtitle: '',
      image: '',
      startTime: '',
      endTime: '',
      buttonText: '立即参与',
      buttonLink: ''
    }
  },
  {
    type: 'custom-html',
    name: '自定义HTML',
    icon: '💻',
    description: '自定义HTML内容',
    defaultProps: {
      html: '',
      css: ''
    }
  },
  {
    type: 'product-card',
    name: '商品卡片',
    icon: '🏷️',
    description: '单个商品卡片',
    defaultProps: {
      productId: '',
      showPrice: true,
      showDiscount: true,
      showAddToCart: true
    }
  },
  {
    type: 'tab-nav',
    name: '标签导航',
    icon: '📑',
    description: '标签页导航',
    defaultProps: {
      tabs: [],
      activeTab: 0
    }
  },
  {
    type: 'footer',
    name: '页脚',
    icon: '🦶',
    description: '页面底部信息',
    defaultProps: {
      links: [],
      copyright: '',
      socialLinks: []
    }
  }
]

const onDragStart = (component: ComponentDefinition, event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('componentType', component.type)
    event.dataTransfer.setData('componentProps', JSON.stringify(component.defaultProps))
  }
  emit('drag-start', component.type, component.defaultProps)
}
</script>
```

#### 3.2.3 画布区域组件

```vue
<!-- app/components/admin/CanvasArea.vue -->
<template>
  <div class="canvas-area" @dragover.prevent @drop="onDrop">
    <div
      v-for="(component, index) in components"
      :key="component.id"
      class="canvas-component"
      :class="{ selected: selectedId === component.id }"
      @click="onSelect(component)"
      @dragstart="onDragStart(component, index)"
      @dragover.prevent="onDragOver($event, index)"
      @drop="onDropComponent($event, index)"
      draggable="true"
    >
      <component-renderer :components="[component]" />
      <div class="component-handle">
        <span class="drag-icon">⋮⋮</span>
        <button @click.stop="onDelete(component)">🗑️</button>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="components.length === 0" class="empty-state">
      <p>从左侧拖拽组件到这里开始构建页面</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComponentConfig } from '~/types/component-builder'

const props = defineProps<{
  components: ComponentConfig[]
}>()

const emit = defineEmits<{
  (e: 'drop', position: number): void
  (e: 'component-select', component: ComponentConfig): void
  (e: 'component-move', fromIndex: number, toIndex: number): void
  (e: 'component-delete', componentId: string): void
}>()

const selectedId = ref<string | null>(null)
const dragIndex = ref<number | null>(null)
const dropIndex = ref<number | null>(null)

const onSelect = (component: ComponentConfig) => {
  selectedId.value = component.id
  emit('component-select', component)
}

const onDragStart = (component: ComponentConfig, index: number) => {
  dragIndex.value = index
}

const onDragOver = (event: DragEvent, index: number) => {
  dropIndex.value = index
  
  // 添加视觉反馈
  if (event.currentTarget) {
    (event.currentTarget as HTMLElement).classList.add('drag-over')
  }
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  
  const componentType = event.dataTransfer?.getData('componentType')
  if (componentType) {
    emit('drop', props.components.length)
  }
}

const onDropComponent = (event: DragEvent, index: number) => {
  event.preventDefault()
  
  if (dragIndex.value !== null && dragIndex.value !== index) {
    emit('component-move', dragIndex.value, index)
  }
  
  dragIndex.value = null
  dropIndex.value = null
}

const onDelete = (component: ComponentConfig) => {
  emit('component-delete', component.id)
  if (selectedId.value === component.id) {
    selectedId.value = null
  }
}
</script>
```

#### 3.2.4 属性编辑器组件

```vue
<!-- app/components/admin/PropertyEditor.vue -->
<template>
  <div class="property-editor">
    <h3>组件属性</h3>
    
    <div class="property-group">
      <label>组件名称</label>
      <input 
        v-model="localProps.name" 
        type="text"
        placeholder="输入组件名称"
      />
    </div>
    
    <!-- 动态属性编辑器 -->
    <div 
      v-for="(property, key) in getPropertySchema(component.type)" 
      :key="key"
      class="property-group"
    >
      <label>{{ property.label }}</label>
      
      <!-- 文本输入 -->
      <input
        v-if="property.type === 'string'"
        v-model="localProps[key]"
        type="text"
        :placeholder="property.placeholder"
      />
      
      <!-- 数字输入 -->
      <input
        v-else-if="property.type === 'number'"
        v-model.number="localProps[key]"
        type="number"
        :min="property.min"
        :max="property.max"
      />
      
      <!-- 布尔值（开关） -->
      <label v-else-if="property.type === 'boolean'" class="switch">
        <input v-model="localProps[key]" type="checkbox" />
        <span class="slider"></span>
      </label>
      
      <!-- 下拉选择 -->
      <select
        v-else-if="property.type === 'select'"
        v-model="localProps[key]"
      >
        <option 
          v-for="option in property.options" 
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      
      <!-- 图片上传 -->
      <div v-else-if="property.type === 'image'" class="image-upload">
        <input 
          type="file" 
          accept="image/*"
          @change="onImageUpload($event, key)"
        />
        <img v-if="localProps[key]" :src="localProps[key]" alt="预览" />
      </div>
      
      <!-- 多行文本 -->
      <textarea
        v-else-if="property.type === 'textarea'"
        v-model="localProps[key]"
        :rows="property.rows || 3"
        :placeholder="property.placeholder"
      />
      
      <!-- 颜色选择 -->
      <input
        v-else-if="property.type === 'color'"
        v-model="localProps[key]"
        type="color"
      />
      
      <!-- 数组（列表） -->
      <div v-else-if="property.type === 'array'" class="array-editor">
        <button @click="addArrayItem(key)">+ 添加</button>
        <div 
          v-for="(item, index) in localProps[key]" 
          :key="index"
          class="array-item"
        >
          <input 
            v-model="localProps[key][index]" 
            type="text"
          />
          <button @click="removeArrayItem(key, index)">×</button>
        </div>
      </div>
    </div>
    
    <!-- 高级设置 -->
    <div class="advanced-settings">
      <h4>高级设置</h4>
      <div class="property-group">
        <label>自定义 CSS 类名</label>
        <input v-model="localProps.customClass" type="text" />
      </div>
      <div class="property-group">
        <label>内联样式</label>
        <textarea v-model="localProps.style" rows="4"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComponentConfig, PropertySchema } from '~/types/component-builder'

const props = defineProps<{
  component: ComponentConfig
}>()

const emit = defineEmits<{
  (e: 'update', componentId: string, properties: Record<string, any>): void
}>()

// 本地属性状态（双向绑定）
const localProps = ref<Record<string, any>>({
  ...props.component.props
})

// 监听变化，实时更新
watch(localProps, (newProps) => {
  emit('update', props.component.id, newProps)
}, { deep: true })

// 组件属性 Schema
const propertySchemas: Record<string, Record<string, PropertySchema>> = {
  'carousel': {
    images: {
      type: 'array',
      label: '图片列表',
      placeholder: '输入图片 URL'
    },
    autoplay: {
      type: 'boolean',
      label: '自动播放',
      default: true
    },
    interval: {
      type: 'number',
      label: '播放间隔（毫秒）',
      min: 1000,
      max: 10000,
      default: 3000
    },
    showIndicators: {
      type: 'boolean',
      label: '显示指示器',
      default: true
    }
  },
  'product-list': {
    category: {
      type: 'select',
      label: '商品分类',
      options: [
        { value: 'all', label: '全部' },
        { value: 'hot', label: '热门' },
        { value: 'new', label: '新品' },
        { value: 'discount', label: '折扣' }
      ]
    },
    limit: {
      type: 'number',
      label: '显示数量',
      min: 1,
      max: 20,
      default: 8
    },
    layout: {
      type: 'select',
      label: '布局方式',
      options: [
        { value: 'grid', label: '网格' },
        { value: 'list', label: '列表' }
      ]
    },
    showPrice: {
      type: 'boolean',
      label: '显示价格',
      default: true
    },
    showDiscount: {
      type: 'boolean',
      label: '显示折扣',
      default: true
    }
  },
  'banner': {
    image: {
      type: 'image',
      label: '广告图片'
    },
    link: {
      type: 'string',
      label: '跳转链接',
      placeholder: '输入链接地址'
    },
    title: {
      type: 'string',
      label: '标题',
      placeholder: '输入广告标题'
    },
    subtitle: {
      type: 'string',
      label: '副标题',
      placeholder: '输入广告副标题'
    }
  },
  // 其他组件的属性 Schema...
}

const getPropertySchema = (componentType: string): Record<string, PropertySchema> => {
  return propertySchemas[componentType] || {}
}

const onImageUpload = (event: Event, key: string) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      localProps.value[key] = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const addArrayItem = (key: string) => {
  if (!localProps.value[key]) {
    localProps.value[key] = []
  }
  localProps.value[key].push('')
}

const removeArrayItem = (key: string, index: number) => {
  localProps.value[key].splice(index, 1)
}
</script>
```

---

## ⚙️ 组件配置系统

### 3.1 数据模型设计

```typescript
// app/types/component-builder.ts

/**
 * 页面配置
 */
export interface PageConfig {
  id: string
  name: string
  slug: string // 页面路由
  title: string // SEO 标题
  description: string // SEO 描述
  keywords: string // SEO 关键词
  components: ComponentConfig[] // 组件列表
  status: 'draft' | 'published' | 'archived' // 页面状态
  templateId?: string // 模板 ID
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  authorId: string
}

/**
 * 组件配置
 */
export interface ComponentConfig {
  id: string // 组件唯一标识
  type: string // 组件类型（carousel, product-list, etc.）
  props: Record<string, any> // 组件属性
  position: number // 组件位置
  style?: Record<string, any> // 自定义样式
  customClass?: string // 自定义 CSS 类名
  conditions?: ComponentCondition[] // 显示条件
  animations?: ComponentAnimation[] // 动画效果
  createdAt: Date
  updatedAt: Date
}

/**
 * 组件定义（用于组件库）
 */
export interface ComponentDefinition {
  type: string
  name: string
  icon: string
  description: string
  category: ComponentCategory
  defaultProps: Record<string, any>
  propertySchema: Record<string, PropertySchema>
  preview: string // 预览图 URL
  tags: string[]
}

/**
 * 组件分类
 */
export type ComponentCategory = 
  | 'layout' // 布局组件
  | 'content' // 内容组件
  | 'navigation' // 导航组件
  | 'promotion' // 促销组件
  | 'product' // 商品组件
  | 'custom' // 自定义组件

/**
 * 属性 Schema（用于属性编辑器）
 */
export interface PropertySchema {
  type: 'string' | 'number' | 'boolean' | 'select' | 'image' | 'textarea' | 'color' | 'array' | 'object'
  label: string
  placeholder?: string
  default?: any
  min?: number
  max?: number
  options?: { value: any; label: string }[]
  rows?: number
  required?: boolean
  validation?: (value: any) => string | null // 验证函数
}

/**
 * 组件显示条件
 */
export interface ComponentCondition {
  type: 'user_role' | 'time_range' | 'device' | 'location' | 'custom'
  value: any
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains'
}

/**
 * 组件动画效果
 */
export interface ComponentAnimation {
  type: 'fade' | 'slide' | 'scale' | 'bounce' | 'custom'
  trigger: 'load' | 'scroll' | 'hover' | 'click'
  duration: number
  delay: number
  easing: string
}

/**
 * 模板配置
 */
export interface TemplateConfig {
  id: string
  name: string
  description: string
  thumbnail: string
  components: ComponentConfig[]
  category: 'home' | 'sale' | 'product' | 'custom'
  createdAt: Date
  authorId: string
}

/**
 * 页面版本
 */
export interface PageVersion {
  id: string
  pageId: string
  config: PageConfig
  version: number
  description: string
  createdAt: Date
}
```

### 3.2 配置存储

```typescript
// app/api/modules/page.ts

/**
 * 获取页面配置
 */
export const getPageConfig = async (slug: string): Promise<PageConfig> => {
  const response = await $fetch<ApiResponse<PageConfig>>(`/api/pages/${slug}`)
  return response.data
}

/**
 * 保存页面配置
 */
export const savePageConfig = async (config: PageConfig): Promise<PageConfig> => {
  const response = await $fetch<ApiResponse<PageConfig>>('/api/pages', {
    method: 'POST',
    body: config
  })
  return response.data
}

/**
 * 发布页面
 */
export const publishPage = async (pageId: string): Promise<PageConfig> => {
  const response = await $fetch<ApiResponse<PageConfig>>(`/api/pages/${pageId}/publish`, {
    method: 'POST'
  })
  return response.data
}

/**
 * 获取页面版本历史
 */
export const getPageVersions = async (pageId: string): Promise<PageVersion[]> => {
  const response = await $fetch<ApiResponse<PageVersion[]>>(`/api/pages/${pageId}/versions`)
  return response.data
}

/**
 * 恢复页面版本
 */
export const restorePageVersion = async (pageId: string, versionId: string): Promise<PageConfig> => {
  const response = await $fetch<ApiResponse<PageConfig>>(`/api/pages/${pageId}/versions/${versionId}/restore`, {
    method: 'POST'
  })
  return response.data
}
```

---

## 🚀 组件渲染引擎

### 4.1 核心渲染逻辑

```typescript
// app/composables/useComponentRenderer.ts

import type { ComponentConfig, PageConfig } from '~/types/component-builder'

/**
 * 组件渲染引擎
 */
export const useComponentRenderer = () => {
  // 组件映射表（懒加载）
  const componentImports: Record<string, () => Promise<{ default: any }>> = {
    'carousel': () => import('~/components/builder/Carousel.vue'),
    'product-list': () => import('~/components/builder/ProductList.vue'),
    'navigation': () => import('~/components/builder/Navigation.vue'),
    'banner': () => import('~/components/builder/Banner.vue'),
    'activity-card': () => import('~/components/builder/ActivityCard.vue'),
    'custom-html': () => import('~/components/builder/CustomHtml.vue'),
    'product-card': () => import('~/components/builder/ProductCard.vue'),
    'tab-nav': () => import('~/components/builder/TabNav.vue'),
    'footer': () => import('~/components/builder/Footer.vue'),
    'product-grid': () => import('~/components/builder/ProductGrid.vue'),
    'category-nav': () => import('~/components/builder/CategoryNav.vue'),
    'price-tag': () => import('~/components/builder/PriceTag.vue'),
    'countdown': () => import('~/components/builder/Countdown.vue'),
    'review-list': () => import('~/components/builder/ReviewList.vue')
  }

  // 动态加载组件
  const loadComponent = async (type: string): Promise<any> => {
    const loader = componentImports[type]
    if (!loader) {
      console.warn(`Component type "${type}" not found`)
      return null
    }
    const module = await loader()
    return module.default
  }

  // 渲染组件
  const renderComponent = async (component: ComponentConfig) => {
    const Component = await loadComponent(component.type)
    if (!Component) return null

    return {
      Component,
      props: component.props,
      style: component.style,
      customClass: component.customClass
    }
  }

  // 渲染所有组件
  const renderComponents = async (components: ComponentConfig[]) => {
    const renderedComponents = []

    for (const component of components) {
      // 检查显示条件
      if (!await checkConditions(component.conditions)) {
        continue
      }

      const rendered = await renderComponent(component)
      if (rendered) {
        renderedComponents.push({
          ...rendered,
          config: component
        })
      }
    }

    return renderedComponents
  }

  // 检查显示条件
  const checkConditions = async (conditions?: ComponentCondition[]): Promise<boolean> => {
    if (!conditions || conditions.length === 0) return true

    for (const condition of conditions) {
      switch (condition.type) {
        case 'user_role':
          // 检查用户角色
          const user = useAuth().user
          if (user && user.role !== condition.value) {
            return false
          }
          break
        case 'time_range':
          // 检查时间范围
          const now = new Date()
          const startTime = new Date(condition.value.start)
          const endTime = new Date(condition.value.end)
          if (now < startTime || now > endTime) {
            return false
          }
          break
        case 'device':
          // 检查设备类型
          const device = useDevice().type
          if (device !== condition.value) {
            return false
          }
          break
        case 'location':
          // 检查地理位置
          const location = useLocation()
          if (location && location.region !== condition.value) {
            return false
          }
          break
        case 'custom':
          // 自定义条件
          if (!await condition.value()) {
            return false
          }
          break
      }
    }

    return true
  }

  return {
    loadComponent,
    renderComponent,
    renderComponents,
    checkConditions
  }
}
```

### 4.2 组件渲染器组件

```vue
<!-- app/components/ComponentRenderer.vue -->
<template>
  <div class="component-renderer">
    <div
      v-for="(rendered, index) in renderedComponents"
      :key="rendered.config.id"
      class="rendered-component"
      :class="[rendered.customClass, `component-${rendered.config.type}`]"
      :style="rendered.style"
      :data-component-id="rendered.config.id"
      :data-component-type="rendered.config.type"
    >
      <component 
        :is="rendered.Component" 
        v-bind="rendered.props"
      />
      
      <!-- 动画效果 -->
      <transition
        v-if="rendered.config.animations"
        :name="getAnimationName(rendered.config.animations[0])"
        :duration="getAnimationDuration(rendered.config.animations[0])"
      >
        <div v-show="true"></div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComponentConfig, ComponentAnimation } from '~/types/component-builder'

const props = defineProps<{
  components: ComponentConfig[]
}>()

const { renderComponents } = useComponentRenderer()

const renderedComponents = ref<Awaited<ReturnType<typeof renderComponents>>>([])

// 初始化渲染
onMounted(async () => {
  renderedComponents.value = await renderComponents(props.components)
})

// 监听组件变化
watch(() => props.components, async (newComponents) => {
  renderedComponents.value = await renderComponents(newComponents)
}, { deep: true })

const getAnimationName = (animation: ComponentAnimation): string => {
  const animationMap: Record<string, string> = {
    'fade': 'fade',
    'slide': 'slide',
    'scale': 'scale',
    'bounce': 'bounce'
  }
  return animationMap[animation.type] || ''
}

const getAnimationDuration = (animation: ComponentAnimation): number => {
  return animation.duration || 300
}
</script>

<style scoped>
/* 动画样式 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
</style>
```

---

## 🎯 拖拽交互系统

### 5.1 拖拽实现

```typescript
// app/composables/useDragDrop.ts

/**
 * 拖拽交互系统
 */
export const useDragDrop = () => {
  const draggedElement = ref<HTMLElement | null>(null)
  const dragOverElement = ref<HTMLElement | null>(null)
  const isDragging = ref(false)

  // 开始拖拽
  const onDragStart = (event: DragEvent, element: HTMLElement, data: any) => {
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('application/json', JSON.stringify(data))
    }
    draggedElement.value = element
    isDragging.value = true
    element.classList.add('dragging')
  }

  // 拖拽经过
  const onDragOver = (event: DragEvent, element: HTMLElement) => {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
    dragOverElement.value = element
    element.classList.add('drag-over')
  }

  // 离开拖拽区域
  const onDragLeave = (event: DragEvent, element: HTMLElement) => {
    element.classList.remove('drag-over')
    if (dragOverElement.value === element) {
      dragOverElement.value = null
    }
  }

  // 放置
  const onDrop = (event: DragEvent, element: HTMLElement): any | null => {
    event.preventDefault()
    
    element.classList.remove('drag-over')
    
    if (draggedElement.value) {
      draggedElement.value.classList.remove('dragging')
    }
    
    if (event.dataTransfer) {
      const data = event.dataTransfer.getData('application/json')
      if (data) {
        return JSON.parse(data)
      }
    }
    
    isDragging.value = false
    draggedElement.value = null
    dragOverElement.value = null
    
    return null
  }

  // 结束拖拽
  const onDragEnd = (event: DragEvent, element: HTMLElement) => {
    element.classList.remove('dragging')
    isDragging.value = false
    draggedElement.value = null
    dragOverElement.value = null
  }

  return {
    draggedElement,
    dragOverElement,
    isDragging,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd
  }
}
```

### 5.2 拖拽样式

```css
/* app/assets/css/drag-drop.css */

/* 拖拽中的元素 */
.dragging {
  opacity: 0.5;
  transform: scale(0.95);
  cursor: move;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 拖拽经过的元素 */
.drag-over {
  border: 2px dashed #4f46e5;
  background-color: rgba(79, 70, 229, 0.05);
  border-radius: 8px;
}

/* 组件库中的可拖拽项 */
.component-item {
  cursor: grab;
  transition: all 0.2s ease;
}

.component-item:active {
  cursor: grabbing;
}

.component-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 画布中的组件 */
.canvas-component {
  transition: all 0.2s ease;
  cursor: move;
}

.canvas-component:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.canvas-component.selected {
  border: 2px solid #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

/* 拖拽手柄 */
.component-handle {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
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
```

---

## 🛠️ 组件属性编辑器

### 6.1 属性编辑器核心逻辑

```typescript
// app/composables/usePropertyEditor.ts

import type { ComponentConfig, PropertySchema } from '~/types/component-builder'

/**
 * 属性编辑器逻辑
 */
export const usePropertyEditor = (component: Ref<ComponentConfig | null>) => {
  // 本地属性状态
  const properties = ref<Record<string, any>>({})

  // 监听组件变化
  watch(component, (newComponent) => {
    if (newComponent) {
      properties.value = { ...newComponent.props }
    } else {
      properties.value = {}
    }
  }, { immediate: true })

  // 获取属性 Schema
  const getSchema = (): Record<string, PropertySchema> => {
    if (!component.value) return {}
    return getPropertySchemaForComponent(component.value.type)
  }

  // 更新属性
  const updateProperty = (key: string, value: any) => {
    properties.value[key] = value
    
    // 触发验证
    const schema = getSchema()[key]
    if (schema?.validation) {
      const error = schema.validation(value)
      if (error) {
        console.warn(`Property "${key}" validation error: ${error}`)
      }
    }
  }

  // 批量更新属性
  const updateProperties = (newProperties: Record<string, any>) => {
    properties.value = { ...properties.value, ...newProperties }
  }

  // 重置属性为默认值
  const resetToDefault = () => {
    if (!component.value) return
    const schema = getSchema()
    const defaultProps: Record<string, any> = {}
    
    for (const [key, property] of Object.entries(schema)) {
      if (property.default !== undefined) {
        defaultProps[key] = property.default
      }
    }
    
    properties.value = defaultProps
  }

  // 验证所有属性
  const validate = (): { isValid: boolean; errors: Record<string, string> } => {
    const schema = getSchema()
    const errors: Record<string, string> = {}
    
    for (const [key, property] of Object.entries(schema)) {
      if (property.required && (properties.value[key] === undefined || properties.value[key] === '')) {
        errors[key] = `${property.label} 是必填项`
      }
      
      if (property.validation) {
        const error = property.validation(properties.value[key])
        if (error) {
          errors[key] = error
        }
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  // 获取属性值
  const getProperty = (key: string): any => {
    return properties.value[key]
  }

  return {
    properties,
    getSchema,
    updateProperty,
    updateProperties,
    resetToDefault,
    validate,
    getProperty
  }
}

// 组件属性 Schema 映射
const componentPropertySchemas: Record<string, Record<string, PropertySchema>> = {
  'carousel': {
    images: {
      type: 'array',
      label: '图片列表',
      placeholder: '输入图片 URL',
      required: true
    },
    autoplay: {
      type: 'boolean',
      label: '自动播放',
      default: true
    },
    interval: {
      type: 'number',
      label: '播放间隔（毫秒）',
      min: 1000,
      max: 10000,
      default: 3000
    },
    showIndicators: {
      type: 'boolean',
      label: '显示指示器',
      default: true
    },
    showArrows: {
      type: 'boolean',
      label: '显示箭头',
      default: true
    }
  },
  'product-list': {
    category: {
      type: 'select',
      label: '商品分类',
      options: [
        { value: 'all', label: '全部' },
        { value: 'hot', label: '热门' },
        { value: 'new', label: '新品' },
        { value: 'discount', label: '折扣' },
        { value: 'recommend', label: '推荐' }
      ],
      default: 'all'
    },
    limit: {
      type: 'number',
      label: '显示数量',
      min: 1,
      max: 20,
      default: 8,
      validation: (value) => {
        if (value < 1 || value > 20) {
          return '显示数量必须在 1-20 之间'
        }
        return null
      }
    },
    layout: {
      type: 'select',
      label: '布局方式',
      options: [
        { value: 'grid', label: '网格' },
        { value: 'list', label: '列表' },
        { value: 'waterfall', label: '瀑布流' }
      ],
      default: 'grid'
    },
    showPrice: {
      type: 'boolean',
      label: '显示价格',
      default: true
    },
    showDiscount: {
      type: 'boolean',
      label: '显示折扣',
      default: true
    },
    showAddToCart: {
      type: 'boolean',
      label: '显示加入购物车按钮',
      default: true
    }
  },
  'banner': {
    image: {
      type: 'image',
      label: '广告图片',
      required: true
    },
    link: {
      type: 'string',
      label: '跳转链接',
      placeholder: '输入链接地址'
    },
    title: {
      type: 'string',
      label: '标题',
      placeholder: '输入广告标题'
    },
    subtitle: {
      type: 'string',
      label: '副标题',
      placeholder: '输入广告副标题'
    },
    backgroundColor: {
      type: 'color',
      label: '背景颜色',
      default: '#ffffff'
    },
    textColor: {
      type: 'color',
      label: '文字颜色',
      default: '#333333'
    }
  },
  'activity-card': {
    title: {
      type: 'string',
      label: '活动标题',
      placeholder: '输入活动标题',
      required: true
    },
    subtitle: {
      type: 'string',
      label: '活动副标题',
      placeholder: '输入活动副标题'
    },
    image: {
      type: 'image',
      label: '活动图片'
    },
    startTime: {
      type: 'string',
      label: '开始时间',
      placeholder: '选择开始时间',
      validation: (value) => {
        if (!value) return null
        const date = new Date(value)
        if (isNaN(date.getTime())) {
          return '请输入有效的日期时间'
        }
        return null
      }
    },
    endTime: {
      type: 'string',
      label: '结束时间',
      placeholder: '选择结束时间'
    },
    buttonText: {
      type: 'string',
      label: '按钮文字',
      default: '立即参与'
    },
    buttonLink: {
      type: 'string',
      label: '按钮链接',
      placeholder: '输入按钮跳转链接'
    },
    buttonColor: {
      type: 'color',
      label: '按钮颜色',
      default: '#4f46e5'
    }
  },
  // 其他组件的属性 Schema...
}

const getPropertySchemaForComponent = (componentType: string): Record<string, PropertySchema> => {
  return componentPropertySchemas[componentType] || {}
}
```

---

## 💾 页面保存和发布

### 7.1 保存和发布逻辑

```typescript
// app/composables/usePageManager.ts

import type { PageConfig, PageVersion } from '~/types/component-builder'

/**
 * 页面管理器
 */
export const usePageManager = () => {
  // 当前页面配置
  const pageConfig = ref<PageConfig | null>(null)

  // 历史记录
  const history = ref<PageConfig[]>([])
  const historyIndex = ref(-1)

  // 加载页面
  const loadPage = async (slug: string) => {
    const config = await getPageConfig(slug)
    pageConfig.value = config
    saveToHistory()
  }

  // 保存页面
  const savePage = async (): Promise<PageConfig> => {
    if (!pageConfig.value) {
      throw new Error('No page config to save')
    }

    const savedConfig = await savePageConfig(pageConfig.value)
    pageConfig.value = savedConfig
    saveToHistory()
    
    return savedConfig
  }

  // 发布页面
  const publishPage = async (): Promise<PageConfig> => {
    if (!pageConfig.value) {
      throw new Error('No page config to publish')
    }

    const publishedConfig = await publishPage(pageConfig.value.id)
    pageConfig.value = publishedConfig
    
    return publishedConfig
  }

  // 保存到历史记录
  const saveToHistory = () => {
    if (!pageConfig.value) return

    const configCopy = JSON.parse(JSON.stringify(pageConfig.value))
    
    // 删除当前位置之后的历史
    history.value = history.value.slice(0, historyIndex.value + 1)
    
    // 添加新的历史记录
    history.value.push(configCopy)
    
    // 限制历史记录数量
    if (history.value.length > 50) {
      history.value.shift()
    } else {
      historyIndex.value++
    }
  }

  // 撤销
  const undo = () => {
    if (historyIndex.value > 0) {
      historyIndex.value--
      pageConfig.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
    }
  }

  // 重做
  const redo = () => {
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++
      pageConfig.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
    }
  }

  // 检查是否可以撤销
  const canUndo = computed(() => historyIndex.value > 0)

  // 检查是否可以重做
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  // 创建新页面
  const createPage = async (name: string, slug: string): Promise<PageConfig> => {
    const newConfig: PageConfig = {
      id: `page-${Date.now()}`,
      name,
      slug,
      title: name,
      description: '',
      keywords: '',
      components: [],
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: useAuth().user?.id || 'anonymous'
    }

    const savedConfig = await savePageConfig(newConfig)
    pageConfig.value = savedConfig
    saveToHistory()
    
    return savedConfig
  }

  // 复制页面
  const duplicatePage = async (pageId: string, newName: string, newSlug: string): Promise<PageConfig> => {
    const originalConfig = await getPageConfigById(pageId)
    
    const newConfig: PageConfig = {
      ...originalConfig,
      id: `page-${Date.now()}`,
      name: newName,
      slug: newSlug,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: undefined,
      components: originalConfig.components.map(c => ({
        ...c,
        id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))
    }

    const savedConfig = await savePageConfig(newConfig)
    return savedConfig
  }

  // 获取页面版本历史
  const getVersions = async (pageId: string): Promise<PageVersion[]> => {
    return await getPageVersions(pageId)
  }

  // 恢复版本
  const restoreVersion = async (pageId: string, versionId: string): Promise<PageConfig> => {
    const restoredConfig = await restorePageVersion(pageId, versionId)
    pageConfig.value = restoredConfig
    saveToHistory()
    
    return restoredConfig
  }

  return {
    pageConfig,
    history,
    historyIndex,
    canUndo,
    canRedo,
    loadPage,
    savePage,
    publishPage,
    undo,
    redo,
    createPage,
    duplicatePage,
    getVersions,
    restoreVersion
  }
}
```

### 7.2 工具栏组件

```vue
<!-- app/components/admin/Toolbar.vue -->
<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <h2>{{ pageConfig.name || '页面编辑器' }}</h2>
      <span v-if="pageConfig.status === 'draft'" class="status-badge draft">草稿</span>
      <span v-else-if="pageConfig.status === 'published'" class="status-badge published">已发布</span>
    </div>
    
    <div class="toolbar-center">
      <button 
        class="toolbar-btn" 
        @click="$emit('undo')"
        :disabled="!canUndo"
        title="撤销"
      >
        ↶ 撤销
      </button>
      <button 
        class="toolbar-btn" 
        @click="$emit('redo')"
        :disabled="!canRedo"
        title="重做"
      >
        ↷ 重做
      </button>
      <button 
        class="toolbar-btn" 
        @click="$emit('preview')"
        title="预览"
      >
        👁️ 预览
      </button>
      <button 
        class="toolbar-btn" 
        @click="$emit('template-save')"
        title="保存为模板"
      >
        💾 保存为模板
      </button>
    </div>
    
    <div class="toolbar-right">
      <button 
        class="toolbar-btn secondary" 
        @click="$emit('save')"
      >
        💾 保存
      </button>
      <button 
        class="toolbar-btn primary" 
        @click="$emit('publish')"
        :disabled="pageConfig.status === 'published'"
      >
        🚀 {{ pageConfig.status === 'published' ? '已发布' : '发布' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PageConfig } from '~/types/component-builder'

defineProps<{
  pageConfig: PageConfig
  canUndo: boolean
  canRedo: boolean
}>()

defineEmits<{
  (e: 'save'): void
  (e: 'publish'): void
  (e: 'undo'): void
  (e: 'redo'): void
  (e: 'preview'): void
  (e: 'template-save'): void
}>()
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toolbar-left h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  margin-left: 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.draft {
  background-color: #fef3c7;
  color: #d97706;
}

.status-badge.published {
  background-color: #d1fae5;
  color: #065f46;
}

.toolbar-btn {
  padding: 8px 16px;
  margin-left: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #ffffff;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toolbar-btn:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.toolbar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toolbar-btn.primary {
  background-color: #4f46e5;
  border-color: #4f46e5;
  color: #ffffff;
}

.toolbar-btn.primary:hover:not(:disabled) {
  background-color: #4338ca;
  border-color: #4338ca;
}

.toolbar-btn.secondary {
  background-color: #f3f4f6;
  border-color: #e5e7eb;
}
</style>
```

---

## 📦 组件库设计

### 8.1 组件库核心组件

```vue
<!-- app/components/builder/Carousel.vue -->
<template>
  <div class="carousel" :style="containerStyle">
    <div 
      class="carousel-track" 
      :style="trackStyle"
      ref="trackRef"
    >
      <div
        v-for="(image, index) in images"
        :key="index"
        class="carousel-slide"
        :style="slideStyle"
      >
        <img :src="image.src" :alt="image.alt || `Slide ${index + 1}`" />
        <div v-if="image.title" class="slide-title">{{ image.title }}</div>
        <div v-if="image.description" class="slide-description">{{ image.description }}</div>
      </div>
    </div>
    
    <!-- 箭头 -->
    <button 
      v-if="showArrows"
      class="carousel-arrow prev"
      @click="prevSlide"
    >
      ◀
    </button>
    <button 
      v-if="showArrows"
      class="carousel-arrow next"
      @click="nextSlide"
    >
      ▶
    </button>
    
    <!-- 指示器 -->
    <div v-if