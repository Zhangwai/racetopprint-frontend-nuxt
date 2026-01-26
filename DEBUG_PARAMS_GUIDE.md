# 参数传递调试指南

## 🔍 问题：参数没有传递到后端

### 🎯 已添加日志

我已经在客户端和服务器端都添加了日志，帮助你调试参数传递问题。

### 📱 客户端日志（浏览器控制台）

**位置：** `app\pages\ssr-demo.vue` 第 379-386 行

```typescript
params: () => {
  const params = {
    page: currentPage.value,
    pageSize: pageSize.value
  }
  console.log('📤 发送的参数:', params)
  return params
}
```

**查看方法：**
1. 打开浏览器开发者工具（F12）
2. 切换到 "Console" 标签
3. 刷新页面或点击分页按钮
4. 应该看到：
   ```
   📤 发送的参数: { page: 1, pageSize: 3 }
   ```

### 🖥️ 服务器端日志（终端）

**位置：** `server\api\sales.get.ts` 第 7-14 行

```typescript
const query = getQuery(event)
console.log('📋 接收到的查询参数:', query)

const page = parseInt(query.page as string) || 1
const pageSize = parseInt(query.pageSize as string) || 10
const status = (query.status as string) || ""

console.log(`📄 分页参数: page=${page}, pageSize=${pageSize}`)
```

**查看方法：**
1. 查看运行 `npm run dev` 的终端
2. 刷新页面或点击分页按钮
3. 应该看到：
   ```
   📋 接收到的查询参数: { page: '1', pageSize: '3' }
   📄 分页参数: page=1, pageSize=3
   ```

### 🧪 调试步骤

#### 步骤 1：检查客户端是否发送了参数

1. 打开浏览器
2. 访问：[http://localhost:3002/ssr-demo](http://localhost:3002/ssr-demo)
3. 按 F12 打开开发者工具
4. 切换到 "Console" 标签
5. 刷新页面
6. **应该看到：**
   ```
   📤 发送的参数: { page: 1, pageSize: 3 }
   ```

**如果没有看到：**
- 检查 `useFetch` 是否正确配置
- 检查 `params` 函数是否被调用
- 检查 `watch` 选项是否配置正确

#### 步骤 2：检查网络请求

1. 在开发者工具中切换到 "Network" 标签
2. 刷新页面
3. 找到名为 `sales` 的请求
4. 点击查看详情
5. 查看 "Request URL"：
   ```
   http://localhost:3002/api/sales?page=1&pageSize=3
   ```
6. 应该包含 `?page=1&pageSize=3`

**如果没有参数：**
- 检查 `params` 函数是否正确返回对象
- 检查是否有其他代码修改了请求

#### 步骤 3：检查服务器端是否接收到参数

1. 查看运行 `npm run dev` 的终端
2. 刷新页面
3. **应该看到：**
   ```
   📋 接收到的查询参数: { page: '1', pageSize: '3' }
   📄 分页参数: page=1, pageSize=3
   ```

**如果没有看到：**
- 检查网络请求是否发送到正确的 URL
- 检查服务器是否正常运行
- 检查防火墙或代理设置

#### 步骤 4：测试分页功能

1. 在页面上点击 "下一页 ➡️" 按钮
2. 查看浏览器控制台：
   ```
   📤 发送的参数: { page: 2, pageSize: 3 }
   ```
3. 查看服务器终端：
   ```
   📋 接收到的查询参数: { page: '2', pageSize: '3' }
   📄 分页参数: page=2, pageSize=3
   ```
4. 页面应该显示第 2 页的 3 条活动

### 📊 正常日志示例

**首次加载页面：**
```
[浏览器 Console]
📤 发送的参数: { page: 1, pageSize: 3 }

[服务器 Terminal]
📋 接收到的查询参数: { page: '1', pageSize: '3' }
📄 分页参数: page=1, pageSize=3
```

**点击下一页：**
```
[浏览器 Console]
📄 跳转到第 2 页
📤 发送的参数: { page: 2, pageSize: 3 }

[服务器 Terminal]
📋 接收到的查询参数: { page: '2', pageSize: '3' }
📄 分页参数: page=2, pageSize=3
```

**点击上一页：**
```
[浏览器 Console]
📄 跳转到第 1 页
📤 发送的参数: { page: 1, pageSize: 3 }

[服务器 Terminal]
📋 接收到的查询参数: { page: '1', pageSize: '3' }
📄 分页参数: page=1, pageSize=3
```

### 🔧 常见问题排查

#### 问题 1：客户端没有发送参数

**现象：**
- 浏览器控制台没有 `📤 发送的参数` 日志
- 网络请求 URL 没有 `?page=1&pageSize=3`

**可能原因：**
1. `params` 函数没有正确配置
2. `useFetch` 没有正确执行
3. 页面有错误阻止了代码执行

**解决方法：**
```typescript
// 确保 params 是函数
params: () => ({
  page: currentPage.value,
  pageSize: pageSize.value
})

// 确保 watch 选项正确
watch: [currentPage, pageSize]
```

#### 问题 2：服务器没有接收到参数

**现象：**
- 浏览器控制台有 `📤 发送的参数` 日志
- 服务器终端没有 `📋 接收到的查询参数` 日志

**可能原因：**
1. 请求没有发送到服务器
2. 服务器路由配置错误
3. 网络问题

**解决方法：**
```typescript
// 检查 API 路径是否正确
const { data } = await useFetch('/api/sales', { ... })

// 检查服务器文件是否存在
// server/api/sales.get.ts 应该存在
```

#### 问题 3：参数值不正确

**现象：**
- 发送的参数是 `{ page: undefined, pageSize: undefined }`
- 或接收到的参数是 `{ page: 'NaN', pageSize: 'NaN' }`

**可能原因：**
1. `currentPage` 或 `pageSize` 没有正确定义
2. 变量在使用前没有初始化
3. 类型转换错误

**解决方法：**
```typescript
// 确保变量在使用前定义
const currentPage = ref(1)
const pageSize = ref(3)

// 确保类型转换安全
const page = parseInt(query.page as string) || 1
const pageSize = parseInt(query.pageSize as string) || 10
```

### 📝 代码检查清单

- [ ] `currentPage` 和 `pageSize` 是响应式变量（ref）
- [ ] `currentPage` 和 `pageSize` 在 `useFetch` 之前定义
- [ ] `params` 是函数，不是对象
- [ ] `params` 函数返回正确的对象格式
- [ ] 配置了 `watch: [currentPage, pageSize]`
- [ ] 服务器端使用 `getQuery(event)` 获取参数
- [ ] 服务器端正确解析参数（parseInt）
- [ ] 服务器端有默认值（|| 1, || 10）

### 🎯 预期结果

**正常工作时：**
1. 浏览器控制台显示：`📤 发送的参数: { page: 1, pageSize: 3 }`
2. 服务器终端显示：`📋 接收到的查询参数: { page: '1', pageSize: '3' }`
3. 服务器终端显示：`📄 分页参数: page=1, pageSize=3`
4. 页面显示 3 条活动数据
5. 分页信息显示：`第 1 / 4 页 共 12 条`

**点击下一页后：**
1. 浏览器控制台显示：`📄 跳转到第 2 页`
2. 浏览器控制台显示：`📤 发送的参数: { page: 2, pageSize: 3 }`
3. 服务器终端显示：`📋 接收到的查询参数: { page: '2', pageSize: '3' }`
4. 服务器终端显示：`📄 分页参数: page=2, pageSize=3`
5. 页面显示新的 3 条活动数据
6. 分页信息更新为：`第 2 / 4 页 共 12 条`

### 📚 相关文档

- **[PAGINATION_FIX_SUMMARY.md](file:///c:/Users/15192/Desktop/racetopprint-frontend-nuxt/PAGINATION_FIX_SUMMARY.md)** - 分页功能修复总结
- **[DATA_UPDATE_SUMMARY.md](file:///c:/Users/15192/Desktop/racetopprint-frontend-nuxt/DATA_UPDATE_SUMMARY.md)** - 数据更新说明
- **[PAGINATION_GUIDE.md](file:///c:/Users/15192/Desktop/racetopprint-frontend-nuxt/PAGINATION_GUIDE.md)** - 分页功能完整指南
- **[REFRESH_FEATURE_GUIDE.md](file:///c:/Users/15192/Desktop/racetopprint-frontend-nuxt/REFRESH_FEATURE_GUIDE.md)** - 刷新功能指南

## 🚀 下一步

1. **打开浏览器控制台**（F12 → Console）
2. **查看服务器终端**（运行 `npm run dev` 的窗口）
3. **刷新页面**，观察日志输出
4. **点击分页按钮**，观察日志变化
5. **对比日志**，确认参数是否正确传递

如果看到预期的日志，说明参数传递正常。如果没有看到，请根据上面的排查方法解决问题。

---

**遇到问题？请告诉我：**
- 浏览器控制台显示了什么？
- 服务器终端显示了什么？
- 网络请求的 URL 是什么？
- 页面显示了多少条数据？

我会帮你进一步排查！
