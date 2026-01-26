# useFetch 调用封装 API 指南

## 📋 三种调用方式

### 方法 1: 直接使用 useFetch（推荐）

```typescript
// 基本用法
const { data, pending, error, refresh } = await useFetch('/api/products', {
  // 请求配置
  method: 'GET',
  params: { page: 1, pageSize: 10 },
  
  // 数据转换（重要）
  transform: (response) => {
    // 服务器返回结构: { code, message, data: { list, pagination } }
    if (response.code === 200) {
      return response.data.list // 只返回需要的数据
    }
    return [] // 默认值
  },
  
  // 响应处理
  onResponse({ response }) {
    console.log('Response:', response._data)
  },
  
  // 错误处理
  onResponseError({ response }) {
    console.error('Error:', response._data)
  }
})
```

### 方法 2: useFetch 配合自定义 $fetch

```typescript
const { data, pending, error } = await useFetch('/api/products', {
  // 自定义 $fetch 实现
  $fetch: (url, options) => {
    return $fetch(url, {
      ...options,
      params: { page: 1, pageSize: 5 },
      headers: {
        'Authorization': 'Bearer token'
      }
    })
  },
  
  // 转换数据
  transform: (response) => {
    if (response.code === 200) {
      return response.data.list
    }
    return []
  }
})
```

### 方法 3: useAsyncData（最灵活）

```typescript
const { data, pending, error, refresh } = await useAsyncData(
  'products-key', // 唯一 key，用于缓存
  async () => {
    // 直接调用 API
    const response = await $fetch('/api/products', {
      params: { page: 1, pageSize: 3 }
    })
    
    // 处理响应
    if (response.code === 200) {
      return response.data.list
    }
    return []
  },
  {
    server: true,      // 在服务器端预取
    default: () => [], // 默认值
    watch: [],         // 监听依赖
    transform: (data) => data // 转换数据
  }
)
```

## 🎯 实际使用示例

### 在页面中使用

```vue
<template>
  <div>
    <h1>产品列表</h1>
    
    <div v-if="pending" class="loading">加载中...</div>
    <div v-else-if="error" class="error">❌ {{ error.message }}</div>
    
    <div v-else class="product-list">
      <div v-for="product in products" :key="product.id" class="product-card">
        <h3>{{ product.name }}</h3>
        <p>¥{{ product.price }}</p>
      </div>
    </div>
    
    <button @click="refresh">刷新数据</button>
  </div>
</template>

<script setup lang="ts">
// SSR 数据预取
const { data: products, pending, error, refresh } = await useFetch('/api/products', {
  params: { page: 1, pageSize: 10 },
  transform: (response) => {
    return response.code === 200 ? response.data.list : []
  }
})
</script>
```

### 在组件中使用（客户端）

```vue
<template>
  <div>
    <h2>活动列表</h2>
    
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="errorMsg" class="error">❌ {{ errorMsg }}</div>
    
    <div v-else class="sale-list">
      <div v-for="sale in sales" :key="sale.id" class="sale-item">
        <h3>{{ sale.title }}</h3>
        <p>状态: {{ sale.status }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const sales = ref<any[]>([])
const loading = ref(false)
const errorMsg = ref('')

// 客户端挂载时获取数据
onMounted(async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/sales', {
      params: { page: 1, pageSize: 5 }
    })
    if (response.code === 200) {
      sales.value = response.data.list
    }
  } catch (err: any) {
    errorMsg.value = err.message || '请求失败'
  } finally {
    loading.value = false
  }
})
</script>
```

## ⚙️ 高级配置

### 请求拦截器

```typescript
// 在 nuxt.config.ts 中配置
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  hooks: {
    'app:created': () => {
      // 配置全局 $fetch
      const { $fetch } = useNuxtApp()
      
      $fetch.onRequest(({ request, options }) => {
        // 添加 token
        const token = localStorage.getItem('token')
        if (token) {
          options.headers = new Headers(options.headers)
          options.headers.set('Authorization', `Bearer ${token}`)
        }
      })
      
      $fetch.onResponse(({ response }) => {
        // 统一处理响应
        if (response._data.code !== 200) {
          throw new Error(response._data.message)
        }
      })
      
      $fetch.onResponseError(({ response }) => {
        // 统一处理错误
        console.error('API Error:', response._data)
      })
    }
  }
})
```

### 缓存策略

```typescript
const { data, pending, refresh } = await useFetch('/api/products', {
  // 缓存键
  key: 'products-cache',
  
  // 缓存时间（毫秒）
  cache: {
    maxAge: 5 * 60 * 1000 // 5分钟
  },
  
  // 强制刷新
  force: false,
  
  transform: (response) => response.code === 200 ? response.data.list : []
})
```

## 📊 对比表格

| 特性 | useFetch | useAsyncData | 直接 $fetch |
|------|----------|--------------|------------|
| SSR 支持 | ✅ | ✅ | ❌ |
| 数据缓存 | ✅ | ✅ | ❌ |
| 自动刷新 | ✅ | ✅ | ❌ |
| 依赖监听 | ✅ | ✅ | ❌ |
| 使用复杂度 | 低 | 中 | 高 |
| 灵活性 | 中 | 高 | 最高 |
| 推荐场景 | 简单数据获取 | 复杂数据处理 | 客户端交互 |

## 💡 最佳实践

### 1. 统一响应处理

```typescript
// composables/useApi.ts
export const useApi = () => {
  const fetchData = async <T>(url: string, options: any = {}) => {
    const response = await $fetch(url, options)
    
    if (response.code === 200) {
      return response.data as T
    }
    
    throw new Error(response.message || '请求失败')
  }
  
  return { fetchData }
}

// 使用
const { fetchData } = useApi()
const products = await fetchData<Product[]>('/api/products')
```

### 2. 错误处理

```typescript
const { data, pending, error } = await useFetch('/api/products', {
  transform: (response) => {
    if (response.code === 200) {
      return response.data.list
    }
    throw new Error(response.message)
  }
})

if (error.value) {
  // 显示错误提示
  alert(error.value.message)
}
```

### 3. 加载状态

```typescript
const { data, pending } = await useFetch('/api/products', {
  transform: (response) => response.code === 200 ? response.data.list : []
})

// pending 是响应式的，会自动更新
if (pending.value) {
  // 显示加载动画
}
```

## 🚀 性能优化

1. **只获取需要的数据**
   ```typescript
   transform: (response) => response.data.list // 只返回列表
   ```

2. **合理使用缓存**
   ```typescript
   cache: { maxAge: 5 * 60 * 1000 } // 缓存 5 分钟
   ```

3. **避免重复请求**
   ```typescript
   const { data } = await useFetch('/api/products', {
     key: 'products' // 相同 key 会复用缓存
   })
   ```

4. **懒加载**
   ```typescript
   // 只在需要时加载
   const { data, refresh } = await useFetch('/api/products', {
     lazy: true // 不自动加载
   })
   
   // 需要时手动刷新
   refresh()
   ```

## 📚 相关文档

- [Nuxt useFetch 文档](https://nuxt.com/docs/api/composables/use-fetch)
- [Nuxt useAsyncData 文档](https://nuxt.com/docs/api/composables/use-async-data)
- [ofetch 文档](https://github.com/unjs/ofetch)
