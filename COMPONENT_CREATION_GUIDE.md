# 组件创建指南

本文档详细介绍了如何在本项目中创建新的组件，以 Banner 组件为例。

---

## 📋 创建新组件的步骤

### 步骤 1：创建组件配置文件

**文件路径：** `app/components/builder/config/{component-name}.config.ts`

**示例（Banner 组件）：**
```typescript
// app/components/builder/config/banner.config.ts
import type { ComponentDefinition } from '~/types/component-builder'

export const bannerConfig: ComponentDefinition = {
  type: 'banner',
  name: '广告横幅',
  icon: '📢',
  description: '广告横幅组件，支持图片、标题、按钮',
  category: 'promotion',
  defaultProps: {
    image: 'https://picsum.photos/1200/400?random=1',
    title: '限时优惠',
    subtitle: '全场低至 5 折',
    buttonText: '立即抢购',
    buttonLink: '/sale',
    backgroundColor: '#f0f0f0',
    textColor: '#333333',
    buttonColor: '#4f46e5',
    buttonTextColor: '#ffffff',
    alignment: 'center',
    overlay: true,
    overlayColor: 'rgba(0, 0, 0, 0.3)'
  },
  propertySchema: {
    image: {
      label: '广告图片',
      type: 'string',
      placeholder: '输入图片 URL',
      required: true
    },
    title: {
      label: '标题',
      type: 'string',
      placeholder: '输入标题',
      required: true
    },
    subtitle: {
      label: '副标题',
      type: 'string',
      placeholder: '输入副标题'
    },
    buttonText: {
      label: '按钮文字',
      type: 'string',
      placeholder: '输入按钮文字',
      default: '立即抢购'
    },
    buttonLink: {
      label: '按钮链接',
      type: 'string',
      placeholder: '输入链接地址',
      default: '/sale'
    },
    backgroundColor: {
      label: '背景颜色',
      type: 'color',
      default: '#f0f0f0'
    },
    textColor: {
      label: '文字颜色',
      type: 'color',
      default: '#333333'
    },
    buttonColor: {
      label: '按钮背景色',
      type: 'color',
      default: '#4f46e5'
    },
    buttonTextColor: {
      label: '按钮文字颜色',
      type: 'color',
      default: '#ffffff'
    },
    alignment: {
      label: '内容对齐',
      type: 'select',
      options: [
        { value: 'left', label: '左对齐' },
        { value: 'center', label: '居中对齐' },
        { value: 'right', label: '右对齐' }
      ],
      default: 'center'
    },
    overlay: {
      label: '显示遮罩',
      type: 'boolean',
      default: true
    },
    overlayColor: {
      label: '遮罩颜色',
      type: 'color',
      default: 'rgba(0, 0, 0, 0.3)'
    }
  },
  preview: 'https://picsum.photos/1200/400',
  tags: ['广告', '横幅', '促销', '按钮']
}
```

**配置项说明：**

| 配置项 | 类型 | 说明 |
|--------|------|------|
| **type** | string | 组件类型标识（唯一） |
| **name** | string | 组件名称（显示在组件库中） |
| **icon** | string | 组件图标（Emoji） |
| **description** | string | 组件描述 |
| **category** | string | 组件分类（content/product/promotion/navigation） |
| **defaultProps** | object | 默认属性值 |
| **propertySchema** | object | 属性配置方案（最重要） |
| **preview** | string | 预览图 URL |
| **tags** | array | 标签数组 |

---

### 步骤 2：创建组件 Vue 文件

**文件路径：** `app/components/builder/{ComponentName}.vue`

**示例（Banner 组件）：**
```vue
<!-- app/components/builder/Banner.vue -->
<template>
  <div 
    class="banner"
    :style="containerStyle"
  >
    <img :src="image" :alt="title" class="banner-image" />
    
    <div v-if="overlay" class="banner-overlay" :style="overlayStyle"></div>
    
    <div class="banner-content" :style="contentStyle">
      <h2 v-if="title" class="banner-title" :style="titleStyle">{{ title }}</h2>
      <p v-if="subtitle" class="banner-subtitle" :style="subtitleStyle">{{ subtitle }}</p>
      
      <a 
        v-if="buttonText && buttonLink"
        :href="buttonLink"
        class="banner-button"
        :style="buttonStyle"
      >
        {{ buttonText }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  image: string
  title?: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
  backgroundColor?: string
  textColor?: string
  buttonColor?: string
  buttonTextColor?: string
  alignment?: 'left' | 'center' | 'right'
  overlay?: boolean
  overlayColor?: string
}>()

const containerStyle = computed(() => ({
  backgroundColor: props.backgroundColor || '#f0f0f0',
  position: 'relative',
  width: '100%',
  height: '400px',
  overflow: 'hidden'
}))

const overlayStyle = computed(() => ({
  backgroundColor: props.overlayColor || 'rgba(0, 0, 0, 0.3)',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1
}))

const contentStyle = computed(() => {
  const alignments: Record<string, string> = {
    'left': 'flex-start',
    'center': 'center',
    'right': 'flex-end'
  }
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: alignments[props.alignment || 'center'],
    padding: '40px',
    zIndex: 2
  }
})

const titleStyle = computed(() => ({
  color: props.textColor || '#333333',
  fontSize: '48px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
}))

const subtitleStyle = computed(() => ({
  color: props.textColor || '#333333',
  fontSize: '24px',
  margin: '0 0 24px 0',
  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
}))

const buttonStyle = computed(() => ({
  backgroundColor: props.buttonColor || '#4f46e5',
  color: props.buttonTextColor || '#ffffff',
  padding: '14px 32px',
  fontSize: '18px',
  fontWeight: '600',
  textDecoration: 'none',
  border-radius: '50px',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
}))
</script>

<style scoped>
.banner {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.banner-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  z-index: 2;
}

.banner-title {
  margin: 0 0 16px 0;
  font-size: 48px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.banner-subtitle {
  margin: 0 0 24px 0;
  font-size: 24px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.banner-button {
  display: inline-block;
  padding: 14px 32px;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 50px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.banner-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.banner-button:active {
  transform: translateY(0);
}
</style>
```

**组件开发要点：**

1. **Props 定义** - 使用 `defineProps` 定义组件的属性
2. **响应式样式** - 使用 `computed` 计算样式对象
3. **条件渲染** - 使用 `v-if` 控制元素显示
4. **样式作用域** - 使用 `<style scoped>` 确保样式隔离
5. **交互效果** - 添加 `:hover`、`:active` 等交互效果

---

### 步骤 3：更新组件渲染器

**文件路径：** `app/composables/useComponentRenderer.ts`

**添加新组件的导入：**
```typescript
// app/composables/useComponentRenderer.ts
export const useComponentRenderer = () => {
  const componentImports: Record<string, () => Promise<{ default: any }>> = {
    'carousel': () => import('~/components/builder/Carousel.vue'),
    'product-list': () => import('~/components/builder/ProductList.vue'),
    'banner': () => import('~/components/builder/Banner.vue'),  // ✅ 添加这一行
    // ... 其他组件
  }

  // ... 其他代码
}
```

---

### 步骤 4：更新 Builder 页面

**文件路径：** `app/pages/builder.vue`

**添加新组件的配置导入：**
```typescript
// app/pages/builder.vue
import { carouselConfig } from '~/components/builder/config/carousel.config'
import { productListConfig } from '~/components/builder/config/product-list.config'
import { bannerConfig } from '~/components/builder/config/banner.config'  // ✅ 添加这一行

const components: ComponentDefinition[] = [
  carouselConfig,
  productListConfig,
  bannerConfig  // ✅ 添加这一行
]
```

---

### 步骤 5：更新属性编辑器

**文件路径：** `app/components/builder/BuilderPropertyEditor.vue`

**添加新组件的配置导入：**
```typescript
// app/components/builder/BuilderPropertyEditor.vue
import { carouselConfig } from './config/carousel.config'
import { productListConfig } from './config/product-list.config'
import { bannerConfig } from './config/banner.config'  // ✅ 添加这一行

const componentConfigs: Record<string, ComponentDefinition> = {
  'carousel': carouselConfig,
  'product-list': productListConfig,
  'banner': bannerConfig  // ✅ 添加这一行
}
```

---

## ✅ 完成！

现在你已经成功创建了一个新的 Banner 组件。

**测试步骤：**

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **访问页面编辑器**
   ```
   http://localhost:3000/builder
   ```

3. **测试组件**
   - ✅ 拖拽 Banner 组件到画布
   - ✅ 点击组件 - 右侧属性编辑器显示 Banner 的所有可配置属性
   - ✅ 修改属性 - 画布中的 Banner 实时更新
   - ✅ 保存页面 - 页面配置正确保存

---

## 📚 参考文档

- [组件配置目录](file:///c:/Users/15192/Desktop/racetopprint-frontend-nuxt/app/components/builder/config)
- [Banner 配置](file:///c:/Users/15192/Desktop/racetopprint-frontend-nuxt/app/components/builder/config/banner.config.ts)
- [Banner 组件](file:///c:/Users/15192/Desktop/racetopprint-frontend-nuxt/app/components/builder/Banner.vue)
- [组件渲染器](file:///c:/Users/15192/Desktop/racetopprint-frontend-nuxt/app/composables/useComponentRenderer.ts)
- [页面编辑器](file:///c:/Users/15192/Desktop/racetopprint-frontend-nuxt/app/pages/builder.vue)
- [属性编辑器](file:///c:/Users/15192/Desktop/racetopprint-frontend-nuxt/app/components/builder/BuilderPropertyEditor.vue)

---

## 🎯 常见问题

### Q1: 组件不显示在组件库中？

**A:** 检查以下几点：

1. ✅ 组件配置文件是否正确创建
2. ✅ `type` 是否唯一
3. ✅ 是否在 `app/pages/builder.vue` 中导入了配置
4. ✅ 是否在 `components` 数组中添加了配置

### Q2: 属性编辑器不显示组件的属性？

**A:** 检查以下几点：

1. ✅ 是否在 `BuilderPropertyEditor.vue` 中导入了组件配置
2. ✅ 是否在 `componentConfigs` 对象中添加了配置
3. ✅ `propertySchema` 是否正确定义
4. ✅ 属性类型是否支持（string/number/boolean/select/textarea/color/array）

### Q3: 组件在画布中不显示？

**A:** 检查以下几点：

1. ✅ 组件 Vue 文件是否正确创建
2. ✅ 是否在 `useComponentRenderer.ts` 中添加了组件导入
3. ✅ 组件的 `type` 是否与配置中的 `type` 一致
4. ✅ 组件是否有默认的 `defaultProps`

### Q4: 修改属性后画布不更新？

**A:** 检查以下几点：

1. ✅ 属性编辑器是否使用了 `:model-value` 和 `@update:model-value`
2. ✅ 组件是否使用了响应式的 `computed` 样式
3. ✅ 是否有控制台错误
4. ✅ 是否在 `@update:model-value` 中正确更新了值

---

## 🚀 下一步

现在你已经学会了如何创建新组件，可以尝试创建以下组件：

- **导航栏组件** - Navigation.vue
- **活动卡片组件** - ActivityCard.vue
- **自定义 HTML 组件** - CustomHtml.vue
- **页脚组件** - Footer.vue
- **商品网格组件** - ProductGrid.vue
- **分类导航组件** - CategoryNav.vue
- **价格标签组件** - PriceTag.vue
- **倒计时组件** - Countdown.vue
- **评价列表组件** - ReviewList.vue

---

## 📊 组件类型分类

| 分类 | 说明 | 示例组件 |
|------|------|--------|
| **content** | 内容组件 | 轮播图、广告横幅、活动卡片 |
| **product** | 商品组件 | 商品列表、商品网格、商品卡片 |
| **promotion** | 促销组件 | 倒计时、价格标签、优惠券 |
| **navigation** | 导航组件 | 导航栏、分类导航、页脚 |
| **other** | 其他组件 | 自定义 HTML、评价列表 |

---

## 🎨 属性类型支持

| 属性类型 | 说明 | 配置示例 |
|---------|------|--------|
| **string** | 字符串 | `{ type: 'string', label: '标题' }` |
| **number** | 数字 | `{ type: 'number', label: '数量', min: 1, max: 100 }` |
| **boolean** | 布尔值 | `{ type: 'boolean', label: '显示' }` |
| **select** | 下拉选择 | `{ type: 'select', label: '布局', options: [...] }` |
| **textarea** | 文本域 | `{ type: 'textarea', label: '描述', rows: 3 }` |
| **color** | 颜色选择 | `{ type: 'color', label: '背景色' }` |
| **array** | 数组 | `{ type: 'array', label: '图片列表', itemSchema: {...} }` |

---

**文档创建时间：** 2026-01-26  
**文档版本：** v1.0  
**作者：** Trae AI