# 组件创建详细步骤指南

## 📋 概述

本文档将详细记录如何在项目中创建一个新的组件。我们以创建 **导航栏组件（Navbar）** 为例，逐步演示整个流程。

---

## 🎯 组件创建完整流程

### ✅ 步骤 1：创建组件目录

首先，为新组件创建一个独立的目录。

```bash
# 创建组件目录
mkdir app/components/builder/components/navbar
```

**目录结构：**
```
app/components/builder/components/
├── navbar/              # 导航栏组件目录
│   ├── Navbar.vue       # 组件实现文件
│   └── navbar.config.ts # 组件配置文件
├── banner/
├── carousel/
├── product-list/
└── index.ts             # 组件注册中心
```

---

### ✅ 步骤 2：创建组件 Vue 文件

创建组件的实现文件 `Navbar.vue`。

**文件位置：** `app/components/builder/components/navbar/Navbar.vue`

**文件内容：**
```vue
<template>
  <nav class="navbar" :style="containerStyle">
    <div class="navbar-container">
      <!-- Logo -->
      <div v-if="logo" class="navbar-logo" @click="$emit('logo-click')">
        <img v-if="logo.image" :src="logo.image" :alt="logo.text" class="logo-image" />
        <span v-if="logo.text" class="logo-text">{{ logo.text }}</span>
      </div>

      <!-- 导航菜单 -->
      <div class="navbar-menu">
        <div
          v-for="(item, index) in menuItems"
          :key="index"
          class="nav-item"
          :class="{ 'has-dropdown': item.children && item.children.length > 0 }"
          @mouseenter="activeDropdown = index"
          @mouseleave="activeDropdown = null"
        >
          <a 
            :href="item.url || '#'" 
            class="nav-link"
            @click.stop="$emit('nav-item-click', item)"
          >
            {{ item.label }}
            <span v-if="item.children && item.children.length > 0" class="dropdown-arrow">▼</span>
          </a>

          <!-- 下拉菜单 -->
          <div 
            v-if="item.children && item.children.length > 0"
            class="dropdown-menu"
            :class="{ show: activeDropdown === index }"
          >
            <a
              v-for="(child, childIndex) in item.children"
              :key="childIndex"
              :href="child.url || '#'"
              class="dropdown-item"
              @click.stop="$emit('dropdown-item-click', child)"
            >
              {{ child.label }}
            </a>
          </div>
        </div>
      </div>

      <!-- 右侧操作区 -->
      <div class="navbar-actions">
        <button
          v-if="showSearch"
          class="navbar-action search-btn"
          @click="$emit('search-click')"
        >
            🔍
        </button>
        <button
          v-if="showCart"
          class="navbar-action cart-btn"
          @click="$emit('cart-click')"
        >
            🛒
            <span v-if="cartCount > 0" class="cart-count">{{ cartCount }}</span>
        </button>
        <button
          v-if="showUser"
          class="navbar-action user-btn"
          @click="$emit('user-click')"
        >
            👤
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  // Logo 配置
  logo?: {
    image?: string
    text?: string
  }
  
  // 菜单项
  menuItems?: Array<{
    label: string
    url?: string
    children?: Array<{
      label: string
      url?: string
    }>
  }>
  
  // 显示选项
  showSearch?: boolean
  showCart?: boolean
  showUser?: boolean
  
  // 购物车数量
  cartCount?: number
  
  // 样式配置
  backgroundColor?: string
  textColor?: string
  hoverColor?: string
  dropdownBackgroundColor?: string
  sticky?: boolean
  height?: string
}>()

defineEmits<{
  (e: 'logo-click'): void
  (e: 'nav-item-click', item: any): void
  (e: 'dropdown-item-click', item: any): void
  (e: 'search-click'): void
  (e: 'cart-click'): void
  (e: 'user-click'): void
}>()

const activeDropdown = ref<number | null>(null)

const containerStyle = computed(() => ({
  backgroundColor: props.backgroundColor || '#ffffff',
  position: props.sticky ? 'sticky' : 'relative',
  top: props.sticky ? '0' : 'auto',
  zIndex: props.sticky ? '1000' : 'auto',
  height: props.height || '60px'
}))
</script>

<style scoped>
.navbar {
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

/* Logo */
.navbar-logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.3s;
}

.navbar-logo:hover {
  opacity: 0.8;
}

.logo-image {
  height: 40px;
  margin-right: 10px;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
}

/* 导航菜单 */
.navbar-menu {
  display: flex;
  gap: 30px;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  color: #374151;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s;
}

.nav-link:hover {
  color: #4f46e5;
  background-color: #f3f4f6;
}

/* 下拉菜单 */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s;
  z-index: 1001;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: block;
  padding: 12px 20px;
  text-decoration: none;
  color: #374151;
  font-size: 14px;
  transition: background-color 0.3s;
}

.dropdown-item:hover {
  background-color: #f9fafb;
  color: #4f46e5;
}

/* 右侧操作区 */
.navbar-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.navbar-action {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s;
  position: relative;
}

.navbar-action:hover {
  background-color: #f3f4f6;
  transform: scale(1.1);
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ef4444;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    padding: 10px;
  }

  .navbar-menu {
    flex-direction: column;
    gap: 10px;
    margin: 10px 0;
  }

  .navbar-actions {
    margin-top: 10px;
  }
}
</style>
```

**代码说明：**

1. **Template 部分：**
   - 包含 Logo、导航菜单、下拉菜单、右侧操作区（搜索、购物车、用户）
   - 使用 `v-for` 动态渲染菜单项
   - 使用 `v-if` 条件渲染可选元素
   - 定义了各种事件处理（点击、鼠标悬停等）

2. **Script 部分：**
   - 使用 `defineProps` 定义组件的属性
   - 使用 `defineEmits` 定义组件的事件
   - 使用 `ref` 定义响应式状态
   - 使用 `computed` 计算动态样式

3. **Style 部分：**
   - 使用 `scoped` 确保样式只作用于当前组件
   - 包含响应式设计（`@media (max-width: 768px)`）
   - 使用 CSS 过渡动画（`transition`）

---

### ✅ 步骤 3：创建组件配置文件

创建组件的配置文件 `navbar.config.ts`。

**文件位置：** `app/components/builder/components/navbar/navbar.config.ts`

**文件内容：**
```typescript
import type { ComponentDefinition } from '~/types/component-builder'

export const navbarConfig: ComponentDefinition = {
  type: 'navbar',
  name: '导航栏',
  icon: '🧭',
  description: '网站导航栏组件，支持 Logo、菜单、下拉菜单、搜索、购物车等功能',
  category: 'navigation',
  defaultProps: {
    logo: {
      text: '我的商城',
      image: ''
    },
    menuItems: [
      {
        label: '首页',
        url: '/'
      },
      {
        label: '商品分类',
        children: [
          { label: '服装', url: '/category/clothing' },
          { label: '电子产品', url: '/category/electronics' },
          { label: '家居用品', url: '/category/home' },
          { label: '运动户外', url: '/category/sports' }
        ]
      },
      {
        label: '限时优惠',
        url: '/sale'
      },
      {
        label: '关于我们',
        children: [
          { label: '公司简介', url: '/about/company' },
          { label: '联系我们', url: '/about/contact' },
          { label: '招聘信息', url: '/about/careers' }
        ]
      }
    ],
    showSearch: true,
    showCart: true,
    showUser: true,
    cartCount: 0,
    backgroundColor: '#ffffff',
    textColor: '#374151',
    hoverColor: '#4f46e5',
    dropdownBackgroundColor: '#ffffff',
    sticky: true,
    height: '60px'
  },
  propertySchema: {
    logo: {
      label: 'Logo 配置',
      type: 'object',
      properties: {
        image: {
          label: 'Logo 图片',
          type: 'string',
          placeholder: '输入 Logo 图片 URL'
        },
        text: {
          label: 'Logo 文字',
          type: 'string',
          placeholder: '输入 Logo 文字',
          default: '我的商城'
        }
      }
    },
    menuItems: {
      label: '导航菜单',
      type: 'array',
      itemSchema: {
        label: {
          label: '菜单项文字',
          type: 'string',
          placeholder: '输入菜单项文字',
          required: true
        },
        url: {
          label: '链接地址',
          type: 'string',
          placeholder: '输入链接地址'
        },
        children: {
          label: '子菜单',
          type: 'array',
          itemSchema: {
            label: {
              label: '子菜单项文字',
              type: 'string',
              placeholder: '输入子菜单项文字',
              required: true
            },
            url: {
              label: '链接地址',
              type: 'string',
              placeholder: '输入链接地址'
            }
          }
        }
      },
      required: true
    },
    showSearch: {
      label: '显示搜索按钮',
      type: 'boolean',
      default: true
    },
    showCart: {
      label: '显示购物车按钮',
      type: 'boolean',
      default: true
    },
    showUser: {
      label: '显示用户按钮',
      type: 'boolean',
      default: true
    },
    cartCount: {
      label: '购物车数量',
      type: 'number',
      min: 0,
      max: 99,
      default: 0
    },
    backgroundColor: {
      label: '背景颜色',
      type: 'color',
      default: '#ffffff'
    },
    textColor: {
      label: '文字颜色',
      type: 'color',
      default: '#374151'
    },
    hoverColor: {
      label: '悬停颜色',
      type: 'color',
      default: '#4f46e5'
    },
    dropdownBackgroundColor: {
      label: '下拉菜单背景色',
      type: 'color',
      default: '#ffffff'
    },
    sticky: {
      label: '固定顶部',
      type: 'boolean',
      default: true
    },
    height: {
      label: '导航栏高度',
      type: 'string',
      placeholder: '例如: 60px',
      default: '60px'
    }
  },
  preview: 'https://picsum.photos/800/100',
  tags: ['导航', '菜单', '下拉菜单', '购物车', '搜索', '头部']
}
```

**配置说明：**

| 配置项 | 类型 | 说明 |
|--------|------|------|
| **type** | string | 组件类型（唯一标识） |
| **name** | string | 组件名称（显示在组件库中） |
| **icon** | string | 组件图标（Emoji） |
| **description** | string | 组件描述 |
| **category** | string | 组件分类（content/product/promotion/navigation） |
| **defaultProps** | object | 默认属性值 |
| **propertySchema** | object | 属性配置 Schema（用于生成属性编辑器） |
| **preview** | string | 预览图片 URL |
| **tags** | array | 标签数组 |

**propertySchema 说明：**

每个属性的配置包括：
- `label`：属性标签（显示在属性编辑器中）
- `type`：属性类型（string/number/boolean/select/textarea/color/array/object）
- `placeholder`：输入框占位符
- `default`：默认值
- `required`：是否必填
- `options`：选项列表（select 类型）
- `min/max`：最小值/最大值（number 类型）
- `rows`：行数（textarea 类型）
- `itemSchema`：子项 Schema（array 类型）
- `properties`：属性列表（object 类型）

---

### ✅ 步骤 4：在组件注册中心注册组件

更新组件注册中心 `index.ts`，将新组件注册到系统中。

**文件位置：** `app/components/builder/components/index.ts`

**修改内容：**

```typescript
// app/components/builder/components/index.ts

// ... 其他组件导入 ...

// Navbar 组件（新增）
import { navbarConfig } from './navbar/navbar.config'
export { navbarConfig } from './navbar/navbar.config'
export { default as NavbarComponent } from './navbar/Navbar.vue'

/**
 * 所有组件配置列表
 */
export const componentDefinitions: ComponentDefinition[] = [
  bannerConfig,
  carouselConfig,
  productListConfig,
  navbarConfig  // ✅ 新增
]

/**
 * 组件配置映射表
 */
export const componentConfigMap: Record<string, ComponentDefinition> = {
  'banner': bannerConfig,
  'carousel': carouselConfig,
  'product-list': productListConfig,
  'navbar': navbarConfig  // ✅ 新增
}

/**
 * 组件导入映射表
 */
export const componentImports: Record<string, () => Promise<{ default: any }>> = {
  'banner': () => import('./banner/Banner.vue'),
  'carousel': () => import('./carousel/Carousel.vue'),
  'product-list': () => import('./product-list/ProductList.vue'),
  'navbar': () => import('./navbar/Navbar.vue')  // ✅ 新增
}
```

**注册说明：**

1. **导入配置：** `import { navbarConfig } from './navbar/navbar.config'`
2. **导出配置：** `export { navbarConfig } from './navbar/navbar.config'`
3. **导出组件：** `export { default as NavbarComponent } from './navbar/Navbar.vue'`
4. **添加到组件列表：** 在 `componentDefinitions` 数组中添加 `navbarConfig`
5. **添加到配置映射表：** 在 `componentConfigMap` 中添加 `'navbar': navbarConfig`
6. **添加到导入映射表：** 在 `componentImports` 中添加 `'navbar': () => import('./navbar/Navbar.vue')`

---

### ✅ 步骤 5：测试组件

启动开发服务器，测试新组件是否正常工作。

```bash
npm run dev
```

**访问页面编辑器：** http://localhost:3003/builder

**测试内容：**

1. ✅ **组件库显示** - 检查新组件是否在组件库中显示
2. ✅ **拖拽功能** - 尝试将组件拖拽到画布
3. ✅ **属性编辑** - 检查属性编辑器是否显示组件的所有属性
4. ✅ **组件渲染** - 检查组件在画布中是否正确渲染
5. ✅ **功能测试** - 测试组件的交互功能（点击、悬停等）

---

## 📊 现在的组件库

**已创建的组件：**

| 组件 | 类型 | 分类 | 图标 | 功能 |
|------|------|------|------|------|
| **轮播图** | carousel | content | 🎠 | 图片轮播、自动播放、指示器、箭头 |
| **商品列表** | product-list | product | 📦 | 商品展示、网格布局、列表布局、瀑布流 |
| **广告横幅** | banner | promotion | 📢 | 广告图片、标题、按钮、遮罩、对齐方式 |
| **导航栏** | navbar | navigation | 🧭 | Logo、菜单、下拉菜单、搜索、购物车、用户 |

---

## 🎯 组件创建总结

### ✅ 创建新组件的完整步骤

1. **创建组件目录** - `mkdir app/components/builder/components/{component-name}`
2. **创建组件 Vue 文件** - `{component-name}/{ComponentName}.vue`
3. **创建组件配置文件** - `{component-name}/{component-name}.config.ts`
4. **在组件注册中心注册** - 更新 `app/components/builder/components/index.ts`
5. **测试组件** - 启动开发服务器，测试组件功能

### 📝 关键要点

- **每个组件独立目录** - 便于维护和管理
- **配置与实现分离** - `config.ts` 定义配置，`Vue` 文件实现功能
- **统一注册中心** - 所有组件都在 `index.ts` 中注册
- **类型安全** - 使用 TypeScript 确保类型安全
- **响应式设计** - 组件应支持响应式布局
- **可配置性** - 通过 `propertySchema` 定义可配置的属性

---

## 🔧 常见问题

### Q1: 组件在组件库中不显示？

**检查：**
- 是否在 `componentDefinitions` 数组中添加了组件配置
- 组件配置的 `type` 是否唯一
- 组件配置的 `name` 和 `icon` 是否正确

### Q2: 属性编辑器不显示组件的属性？

**检查：**
- 是否在 `componentConfigMap` 中添加了组件配置
- `propertySchema` 是否正确定义
- 属性类型是否支持（string/number/boolean/select/textarea/color/array/object）

### Q3: 组件在画布中不显示？

**检查：**
- 是否在 `componentImports` 中添加了组件加载器
- 组件的 `type` 是否与配置中的 `type` 一致
- 组件 Vue 文件是否有语法错误
- 浏览器控制台是否有报错

### Q4: 修改组件后页面没有更新？

**解决：**
- 检查是否保存了文件
- 尝试刷新浏览器（Ctrl+R）
- 检查开发服务器是否正常运行
- 查看终端是否有编译错误

---

## 🚀 下一步

现在你已经学会了如何创建组件，可以尝试创建以下组件：

- **页脚组件（Footer）** - 网站底部信息、链接、版权声明
- **商品卡片组件（ProductCard）** - 单个商品的展示卡片
- **搜索框组件（SearchBox）** - 搜索输入框、搜索按钮
- **登录表单组件（LoginForm）** - 用户名、密码输入框、登录按钮
- **购物车组件（Cart）** - 购物车列表、数量调整、结算按钮
- **用户菜单组件（UserMenu）** - 用户信息、下拉菜单

---

## 📚 参考文档

- [Vue 3 官方文档](https://vuejs.org/)
- [Nuxt 4 官方文档](https://nuxt.com/docs/4.x/getting-started/introduction)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [组件注册中心](app/components/builder/components/index.ts)
- [组件类型定义](app/types/component-builder.ts)

---

## ✅ 完成！

恭喜你已经成功创建了导航栏组件！现在你可以：

1. 在页面编辑器中使用新组件
2. 根据需要修改组件的配置
3. 创建更多的组件
4. 继续完善项目功能

**访问页面编辑器：** http://localhost:3003/builder

**开始使用新组件吧！** 🎊

---

*本文档创建时间：2026-01-26*
*最后更新时间：2026-01-26*
*版本：v1.0*
