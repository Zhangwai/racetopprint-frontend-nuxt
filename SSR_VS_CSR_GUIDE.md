# SSR vs CSR 对比指南

## 📋 什么是 SSR 和 CSR

### SSR（Server-Side Rendering）- 服务器端渲染
- **数据在服务器端获取**，页面渲染完成后再发送到浏览器
- 首次加载速度快，SEO 友好
- 适合内容型网站、博客、电商网站

### CSR（Client-Side Rendering）- 客户端渲染
- **数据在浏览器端获取**，页面在浏览器中动态渲染
- 交互性强，用户体验好
- 适合单页应用、后台管理系统

## 🔄 修改说明

### 已将第一个产品列表从 SSR 改为 CSR

**修改前（SSR）：**
```typescript
// 使用 useAsyncData 进行 SSR 预取
const { data: products, loading, error } = await useAsyncData(
  'products',
  () => fetchProducts(),
  {
    server: true,      // 在服务器端预取
    default: () => [], // 默认值
    watch: []          // 监听依赖
  }
)
```

**修改后（CSR）：**
```typescript
// CSR: 在客户端获取数据（使用 onMounted）
const products = ref<Product[]>([])
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  loading.value = true
  try {
    // 模拟网络请求（在客户端执行）
    const startTime = Date.now()
    await new Promise(resolve => setTimeout(resolve, 300))
    loadTime.value = Date.now() - startTime
    
    products.value = mockProducts
  } catch (err: any) {
    error.value = err.message || '加载失败'
  } finally {
    loading.value = false
  }
})
```

## 🎯 两种方式的对比

| 特性 | SSR（useAsyncData/useFetch） | CSR（onMounted） |
|------|------------------------------|------------------|
| 数据获取位置 | 服务器端 | 浏览器端 |
| 首次加载速度 | 快 | 慢（需要下载 JS） |
| SEO 友好 | ✅ 是 | ❌ 否（需要 SSR） |
| 交互性 | ⚠️ 中等 | ✅ 好 |
| 服务器负载 | 高 | 低 |
| 缓存策略 | 内置缓存 | 需要手动实现 |
| 使用场景 | 内容展示页面 | 交互性强的页面 |
| 代码复杂度 | 低（Nuxt 自动处理） | 高（手动管理状态） |

## 📊 实际效果对比

### SSR 效果
- 页面加载时数据已经存在
- 查看页面源代码可以看到数据
- 适合搜索引擎爬虫

### CSR 效果
- 页面加载后显示加载动画
- 数据在浏览器中动态获取
- 查看页面源代码看不到数据
- 适合需要用户交互的场景

## 🚀 如何选择

### 使用 SSR 的场景

1. **内容型网站**
   - 博客、新闻网站
   - 电商产品列表
   - 营销页面

2. **SEO 需求高**
   - 需要搜索引擎收录
   - 需要社交平台分享

3. **首次加载速度要求高**
   - 移动端网络慢
   - 用户体验优先

### 使用 CSR 的场景

1. **交互性强的应用**
   - 后台管理系统
   - 仪表盘
   - 编辑器

2. **需要用户登录**
   - 个人中心
   - 购物车
   - 订单管理

3. **数据频繁变化**
   - 实时数据展示
   - 聊天应用
   - 协作工具

## 💡 混合使用策略

最佳实践是根据页面类型选择合适的渲染方式：

```typescript
// 首页 - SSR
const { data: products } = await useFetch('/api/products')

// 个人中心 - CSR
const userInfo = ref(null)
onMounted(async () => {
  userInfo.value = await fetchUserInfo()
})

// 产品详情 - SSR
const { data: product } = await useFetch(`/api/products/${id}`)

// 购物车 - CSR
const cart = ref([])
onMounted(async () => {
  cart.value = await fetchCart()
})
```

## 📁 相关文件

- **[ssr-demo.vue](file:///c:/Users/15192/Desktop/racetopprint-frontend-nuxt/app/pages/ssr-demo.vue)** - SSR 和 CSR 演示页面
- **[API_USAGE_GUIDE.md](file:///c:/Users/15192/Desktop/racetopprint-frontend-nuxt/API_USAGE_GUIDE.md)** - API 使用指南

## 🔧 Nuxt 3 中的渲染方式

### 1. 全 SSR（默认）
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true // 默认值
})
```

### 2. 全 CSR
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false
})
```

### 3. 混合模式（推荐）
```typescript
// 页面级配置
// app/pages/about.vue
export default definePageConfig({
  ssr: false // 该页面使用 CSR
})
```

## 🎓 总结

- **SSR** 适合内容展示和 SEO 优化
- **CSR** 适合交互性强的应用
- Nuxt 3 支持灵活的混合渲染策略
- 根据页面类型选择最合适的渲染方式

现在你可以访问 [http://localhost:3000/ssr-demo](http://localhost:3000/ssr-demo) 查看实际效果！
