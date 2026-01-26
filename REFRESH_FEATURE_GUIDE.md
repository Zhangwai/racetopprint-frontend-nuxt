# 刷新功能使用指南

## ✅ 已为活动列表添加刷新功能

### 🎯 功能说明

第二个活动列表（SSR 预取）现在支持重新刷新数据！

### 📱 使用方法

1. **点击刷新按钮**
   - 在活动列表标题右侧有一个紫色渐变的刷新按钮
   - 点击按钮即可重新获取活动数据

2. **加载状态提示**
   - 刷新时按钮会显示旋转动画
   - 按钮文字变为"刷新中..."
   - 按钮暂时禁用，防止重复点击

3. **查看控制台**
   - 打开浏览器开发者工具（F12）
   - 切换到 Console 标签
   - 可以看到刷新日志：
     - `🔄 刷新活动列表...`
     - `✅ 活动列表已刷新`

### 🔧 实现原理

#### 1. 解构 refresh 方法

```typescript
// 从 useFetch 中解构出 refresh 方法
const { data: sales, loading: salesLoading, error: salesError, refresh } = await useFetch(
  '/api/sales',
  {
    method: 'GET',
    params: { page: 1, pageSize: 10 },
    transform: (response) => {
      if (response.code === 200) {
        return response.data.list
      }
      return []
    }
  }
)
```

#### 2. 创建刷新函数

```typescript
// 刷新活动列表
const refreshSales = async () => {
  console.log('🔄 刷新活动列表...')
  await refresh() // 调用 refresh 方法重新获取数据
  console.log('✅ 活动列表已刷新')
}
```

#### 3. 添加刷新按钮

```vue
<div class="section-header">
  <h2>🎉 活动列表（SSR 预取）</h2>
  <button @click="refreshSales" :disabled="salesLoading" class="refresh-btn">
    <span v-if="salesLoading" class="btn-loading"></span>
    {{ salesLoading ? '刷新中...' : '🔄 刷新' }}
  </button>
</div>
```

#### 4. 按钮样式

```css
/* 刷新按钮样式 */
.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

/* 按钮加载动画 */
.btn-loading {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### 💡 useFetch 的刷新机制

#### 核心特性

1. **自动缓存**
   - useFetch 会自动缓存数据
   - 相同请求不会重复发送

2. **refresh 方法**
   - 强制重新获取数据
   - 绕过缓存机制
   - 更新响应式数据

3. **刷新选项**
   ```typescript
   // 刷新时可以传递新的参数
   await refresh({
     params: { page: 2, pageSize: 10 }
   })
   ```

#### 刷新策略

1. **手动刷新**（本示例使用）
   ```typescript
   const { refresh } = useFetch('/api/sales')
   // 点击按钮时调用
   await refresh()
   ```

2. **自动刷新**
   ```typescript
   const { data, refresh } = useFetch('/api/sales', {
     watch: [someReactiveValue] // 监听依赖变化自动刷新
   })
   ```

3. **定时刷新**
   ```typescript
   onMounted(() => {
     setInterval(async () => {
       await refresh()
     }, 30000) // 每 30 秒刷新一次
   })
   ```

### 🎨 UI 交互设计

#### 按钮状态

1. **默认状态**
   - 紫色渐变背景
   - 鼠标悬停时上移 2px
   - 显示阴影效果

2. **加载状态**
   - 显示旋转动画
   - 文字变为"刷新中..."
   - 按钮禁用（透明度 0.7）
   - 光标变为禁止符号

3. **禁用状态**
   - 数据加载时自动禁用
   - 防止重复提交
   - 提升用户体验

#### 动画效果

1. **悬停动画**
   - 上移动画（transform: translateY(-2px)）
   - 阴影增强（box-shadow 变大）
   - 过渡时间 0.3s

2. **旋转动画**
   - 线性旋转（linear）
   - 1 秒完成一圈
   - 无限循环（infinite）

### 📊 应用场景

#### 适合使用刷新功能的场景

1. **实时数据展示**
   - 股票行情
   - 新闻资讯
   - 实时监控

2. **用户交互后**
   - 提交表单后
   - 删除数据后
   - 更新信息后

3. **定时刷新**
   - 仪表盘
   - 统计数据
   - 状态监控

#### 不适合使用刷新功能的场景

1. **静态数据**
   - 页面配置
   - 帮助文档
   - 静态内容

2. **数据量大**
   - 大数据列表
   - 复杂报表
   - 建议使用分页

### 🚀 扩展功能

#### 1. 添加刷新提示

```typescript
const lastRefreshTime = ref(null)

const refreshSales = async () => {
  console.log('🔄 刷新活动列表...')
  await refresh()
  lastRefreshTime.value = new Date().toLocaleTimeString()
  console.log('✅ 活动列表已刷新')
}
```

```vue
<button @click="refreshSales" :disabled="salesLoading" class="refresh-btn">
  {{ salesLoading ? '刷新中...' : '🔄 刷新' }}
  <span v-if="lastRefreshTime" class="last-refresh">
    最后刷新: {{ lastRefreshTime }}
  </span>
</button>
```

#### 2. 添加错误重试

```typescript
const refreshSales = async () => {
  console.log('🔄 刷新活动列表...')
  try {
    await refresh()
    console.log('✅ 活动列表已刷新')
  } catch (error) {
    console.error('❌ 刷新失败:', error)
    // 可以显示错误提示
  }
}
```

#### 3. 添加防抖

```typescript
import { debounce } from 'lodash'

const refreshSales = debounce(async () => {
  console.log('🔄 刷新活动列表...')
  await refresh()
  console.log('✅ 活动列表已刷新')
}, 500) // 500ms 防抖
```

### 📁 相关文件

- **[ssr-demo.vue](file:///c:/Users/15192/Desktop/racetopprint-frontend-nuxt/app/pages/ssr-demo.vue)** - SSR 演示页面（已添加刷新功能）
- **[SSR_VS_CSR_GUIDE.md](file:///c:/Users/15192/Desktop/racetopprint-frontend-nuxt/SSR_VS_CSR_GUIDE.md)** - SSR 和 CSR 对比指南
- **[API_USAGE_GUIDE.md](file:///c:/Users/15192/Desktop/racetopprint-frontend-nuxt/API_USAGE_GUIDE.md)** - API 使用指南

## 🎓 总结

useFetch 的 refresh 方法是一个强大的工具，可以：

1. ✅ 手动刷新数据
2. ✅ 绕过缓存机制
3. ✅ 更新响应式数据
4. ✅ 提升用户体验

现在你可以访问 [http://localhost:3000/ssr-demo](http://localhost:3000/ssr-demo) 体验刷新功能！

点击"🔄 刷新"按钮，观察数据重新加载的过程！🎉
