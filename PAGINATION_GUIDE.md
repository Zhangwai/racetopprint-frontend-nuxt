# 分页功能使用指南

## ✅ 已为活动列表添加分页功能

### 🎯 功能说明

第二个活动列表（SSR 预取）现在支持分页浏览！

### 📱 使用方法

1. **查看分页信息**
   - 活动列表底部显示分页控件
   - 显示当前页码和总页数
   - 显示总数据条数

2. **翻页操作**
   - 点击"⬅️ 上一页"跳转到上一页
   - 点击"下一页 ➡️"跳转到下一页
   - 第一页时"上一页"按钮禁用
   - 最后一页时"下一页"按钮禁用

3. **查看控制台**
   - 打开浏览器开发者工具（F12）
   - 切换到 Console 标签
   - 可以看到翻页日志：
     - `📄 跳转到第 2 页`
     - `Sales API Response: { ... }`

### 🔧 实现原理

#### 1. 分页状态管理

```typescript
// 分页状态管理
const currentPage = ref(1)
const pageSize = ref(3) // 每页显示 3 条数据
const totalPages = ref(1)
const totalCount = ref(0)
```

#### 2. 动态参数传递

```typescript
const { data: sales, loading: salesLoading, error: salesError, refresh: refreshSalesData } = await useFetch(
  '/api/sales',
  {
    method: 'GET',
    // 使用计算属性作为参数，支持动态更新
    params: () => ({
      page: currentPage.value,
      pageSize: pageSize.value
    }),
    
    // 数据转换
    transform: (response) => {
      if (response.code === 200) {
        // 更新分页信息
        if (response.data.pagination) {
          totalPages.value = response.data.pagination.totalPages
          totalCount.value = response.data.pagination.total
        }
        return response.data.list
      }
      return []
    }
  }
)
```

#### 3. 分页逻辑实现

```typescript
// 分页逻辑
const goToPage = async (page: number) => {
  // 边界检查
  if (page < 1 || page > totalPages.value) return
  
  console.log(`📄 跳转到第 ${page} 页`)
  currentPage.value = page
  await refreshSalesData() // 刷新数据
}

const goToNextPage = async () => {
  if (currentPage.value < totalPages.value) {
    await goToPage(currentPage.value + 1)
  }
}

const goToPrevPage = async () => {
  if (currentPage.value > 1) {
    await goToPage(currentPage.value - 1)
  }
}
```

#### 4. 分页按钮UI

```vue
<!-- 分页控件 -->
<div class="pagination">
  <button @click="goToPrevPage" :disabled="currentPage === 1" class="pagination-btn prev-btn">
    ⬅️ 上一页
  </button>
  
  <div class="pagination-info">
    <span>第 {{ currentPage }} / {{ totalPages }} 页</span>
    <span class="total-count">共 {{ totalCount }} 条</span>
  </div>
  
  <button @click="goToNextPage" :disabled="currentPage === totalPages" class="pagination-btn next-btn">
    下一页 ➡️
  </button>
</div>
```

#### 5. 分页样式

```css
/* 分页样式 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.pagination-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.prev-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.next-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.pagination-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### 💡 useFetch 动态参数机制

#### 核心特性

1. **计算属性参数**
   ```typescript
   params: () => ({
     page: currentPage.value,
     pageSize: pageSize.value
   })
   ```
   - 使用函数返回参数
   - 支持响应式数据
   - 每次请求都会重新计算

2. **refresh 方法**
   - 强制重新获取数据
   - 自动使用最新参数
   - 更新响应式数据

3. **数据转换**
   ```typescript
   transform: (response) => {
     if (response.code === 200) {
       // 更新分页信息
       if (response.data.pagination) {
         totalPages.value = response.data.pagination.totalPages
         totalCount.value = response.data.pagination.total
       }
       return response.data.list
     }
     return []
   }
   ```
   - 在数据返回后处理
   - 更新分页状态
   - 返回需要的数据

### 🎨 UI 交互设计

#### 按钮状态

1. **默认状态**
   - 渐变背景色
   - 鼠标悬停时上移 2px
   - 显示阴影效果

2. **禁用状态**
   - 第一页时"上一页"禁用
   - 最后一页时"下一页"禁用
   - 透明度降低（0.5）
   - 光标变为禁止符号

3. **分页信息**
   - 显示当前页码/总页数
   - 显示总数据条数
   - 居中对齐

#### 动画效果

1. **悬停动画**
   - 上移动画（transform: translateY(-2px)）
   - 阴影增强
   - 过渡时间 0.3s

2. **禁用状态**
   - 无动画效果
   - 保持原位

### 📊 API 响应结构

服务器返回的数据结构：

```typescript
{
  code: 200,
  message: 'success',
  data: {
    list: [/* 活动数据 */],
    pagination: {
      page: 1,
      pageSize: 3,
      total: 10,
      totalPages: 4
    }
  }
}
```

### 🚀 扩展功能

#### 1. 页码快速跳转

```typescript
const pageInput = ref('')

const jumpToPage = async () => {
  const page = parseInt(pageInput.value)
  if (page >= 1 && page <= totalPages.value) {
    await goToPage(page)
  }
  pageInput.value = ''
}
```

```vue
<div class="page-jump">
  <input v-model="pageInput" type="number" placeholder="页码" />
  <button @click="jumpToPage">跳转</button>
</div>
```

#### 2. 每页数量选择

```typescript
const pageSizeOptions = [3, 5, 10, 20]

const changePageSize = async (size: number) => {
  pageSize.value = size
  currentPage.value = 1 // 重置到第一页
  await refreshSalesData()
}
```

```vue
<div class="page-size-select">
  <span>每页显示：</span>
  <select v-model="pageSize" @change="changePageSize(pageSize)">
    <option v-for="size in pageSizeOptions" :key="size" :value="size">
      {{ size }} 条
    </option>
  </select>
</div>
```

#### 3. 页码导航

```typescript
// 生成显示的页码范围
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})
```

```vue
<div class="page-nav">
  <button 
    v-for="page in visiblePages" 
    :key="page"
    @click="goToPage(page)"
    :class="{ active: page === currentPage }"
  >
    {{ page }}
  </button>
</div>
```

### 📁 相关文件

- **[ssr-demo.vue](file:///c:/Users/15192/Desktop/racetopprint-frontend-nuxt/app/pages/ssr-demo.vue)** - SSR 演示页面（已添加分页功能）
- **[SSR_VS_CSR_GUIDE.md](file:///c:/Users/15192/Desktop/racetopprint-frontend-nuxt/SSR_VS_CSR_GUIDE.md)** - SSR 和 CSR 对比指南
- **[REFRESH_FEATURE_GUIDE.md](file:///c:/Users/15192/Desktop/racetopprint-frontend-nuxt/REFRESH_FEATURE_GUIDE.md)** - 刷新功能指南
- **[API_USAGE_GUIDE.md](file:///c:/Users/15192/Desktop/racetopprint-frontend-nuxt/API_USAGE_GUIDE.md)** - API 使用指南

## 🎓 总结

分页功能的实现步骤：

1. ✅ 定义分页状态（currentPage, pageSize, totalPages, totalCount）
2. ✅ 使用动态参数传递给 useFetch
3. ✅ 实现分页逻辑（goToPage, goToNextPage, goToPrevPage）
4. ✅ 添加分页按钮UI
5. ✅ 美化分页样式
6. ✅ 测试分页功能

现在你可以访问 [http://localhost:3000/ssr-demo](http://localhost:3000/ssr-demo) 体验分页功能！

点击"下一页 ➡️"按钮，浏览不同页的活动数据！🎉
