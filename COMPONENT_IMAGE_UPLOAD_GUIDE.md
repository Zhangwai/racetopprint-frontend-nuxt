# 组件图片上传指南

## 📋 概述

本文档介绍如何在组件中使用图片上传功能，支持 OSS 前端直传。

## 🎯 功能特性

- ✅ **OSS 前端直传**：直接上传到阿里云 OSS，无需经过后端
- ✅ **拖拽上传**：支持点击和拖拽两种上传方式
- ✅ **图片预览**：实时预览已上传的图片
- ✅ **进度显示**：显示上传进度百分比
- ✅ **错误处理**：完善的错误提示和处理机制
- ✅ **格式验证**：支持 JPG、PNG、GIF、WebP 格式
- ✅ **大小限制**：可配置最大文件大小
- ✅ **响应式设计**：适配不同屏幕尺寸

## 📁 文件结构

```
app/
├── components/
│   └── builder/
│       └── property-editors/
│           └── ImageUpload.vue          # 图片上传组件
├── types/
│   └── oss.ts                           # OSS 类型定义
├── utils/
│   └── oss-upload.ts                    # OSS 上传工具类
└── .env.example                         # 环境变量示例
```

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装 crypto 相关依赖（用于生成签名）
npm install crypto-js
# 或
npm install node:crypto
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写 OSS 配置：

```env
# .env
OSS_REGION=oss-cn-hangzhou
OSS_ACCESS_KEY_ID=your-access-key-id
OSS_ACCESS_KEY_SECRET=your-access-key-secret
OSS_BUCKET=your-bucket-name
OSS_ENDPOINT=https://your-bucket.oss-cn-hangzhou.aliyuncs.com
```

### 3. 在组件配置中使用

在组件的 `index.config.ts` 中，将需要图片上传的属性类型设置为 `image`：

```typescript
// app/components/builder/components/carousel/index.config.ts
export default {
  type: 'carousel',
  name: '轮播图',
  // ...
  propertySchema: {
    images: {
      label: '轮播图片',
      type: 'array',
      itemType: 'object',
      itemSchema: {
        src: {
          label: '图片',
          type: 'image',  // 使用图片上传组件
          placeholder: '点击上传图片'
        },
        // ...
      }
    }
  }
}
```

## 🎨 组件使用

### 基础用法

```vue
<template>
  <ImageUpload 
    v-model="imageUrl"
    placeholder="点击上传图片"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ImageUpload from '~/components/builder/property-editors/ImageUpload.vue'

const imageUrl = ref<string | null>(null)
</script>
```

### 高级用法

```vue
<template>
  <ImageUpload 
    v-model="imageUrl"
    :multiple="false"
    :max-size="10 * 1024 * 1024"
    :allowed-types="['image/jpeg', 'image/png']"
    directory="uploads/carousel/"
    placeholder="点击或拖拽上传图片"
    :disabled="false"
    @success="handleSuccess"
    @error="handleError"
    @uploading="handleUploading"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ImageUpload from '~/components/builder/property-editors/ImageUpload.vue'

const imageUrl = ref<string | null>(null)

const handleSuccess = (url: string) => {
  console.log('上传成功:', url)
}

const handleError = (error: string) => {
  console.error('上传失败:', error)
}

const handleUploading = (progress: number) => {
  console.log('上传进度:', progress)
}
</script>
```

## 📝 Props 说明

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `modelValue` | `string \\| null` | `null` | 绑定的图片 URL |
| `multiple` | `boolean` | `false` | 是否支持多图上传 |
| `maxSize` | `number` | `10 * 1024 * 1024` | 最大文件大小（字节） |
| `allowedTypes` | `string[]` | `['image/jpeg', 'image/png', 'image/gif', 'image/webp']` | 允许的文件类型 |
| `directory` | `string` | `'uploads/images/'` | OSS 存储目录 |
| `placeholder` | `string` | `'点击或拖拽上传图片'` | 占位文本 |
| `disabled` | `boolean` | `false` | 是否禁用 |

## 🎉 Events 说明

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `update:modelValue` | `string \\| null` | 图片 URL 变化时触发 |
| `success` | `string` | 上传成功时触发，返回图片 URL |
| `error` | `string` | 上传失败时触发，返回错误信息 |
| `uploading` | `number` | 上传进度变化时触发，返回进度百分比 |

## 🔧 OSS 配置

### 1. 获取 OSS 凭证

1. 登录阿里云控制台
2. 进入 OSS 管理控制台
3. 创建或选择一个 Bucket
4. 获取 Access Key ID 和 Access Key Secret
5. 配置 Bucket 的跨域规则（CORS）

### 2. 配置 CORS 规则

在 OSS 控制台的 Bucket 配置中，添加以下 CORS 规则：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
    <ExposeHeader>ETag</ExposeHeader>
    <ExposeHeader>x-oss-request-id</ExposeHeader>
  </CORSRule>
</CORSConfiguration>
```

### 3. 安全建议

- ❌ **不要在前端暴露长期有效的 Access Key**
- ✅ **使用 STS 临时凭证**（推荐）
- ✅ **配置 Bucket 的访问权限**
- ✅ **设置上传文件的大小限制**
- ✅ **配置防盗链**

## 📚 工具类使用

### 创建 OSS 上传器

```typescript
import { createOSSUploader } from '~/utils/oss-upload'

const uploader = createOSSUploader({
  region: 'oss-cn-hangzhou',
  accessKeyId: 'your-access-key-id',
  accessKeySecret: 'your-access-key-secret',
  bucket: 'your-bucket-name'
}, {
  directory: 'uploads/images/',
  maxSize: 10 * 1024 * 1024,
  allowedTypes: ['image/jpeg', 'image/png']
})
```

### 上传文件

```typescript
const file = document.querySelector('input[type="file"]').files[0]
const result = await uploader.uploadFile(file)

if (result.success) {
  console.log('上传成功:', result.url)
} else {
  console.error('上传失败:', result.error)
}
```

### 上传 Base64 图片

```typescript
const base64 = 'data:image/png;base64,iVBORw0KGgo...'
const result = await uploader.uploadBase64(base64, 'custom-filename.png')

if (result.success) {
  console.log('上传成功:', result.url)
}
```

### 删除文件

```typescript
const url = 'https://your-bucket.oss-cn-hangzhou.aliyuncs.com/uploads/images/12345.png'
const success = await uploader.deleteFile(url)

if (success) {
  console.log('删除成功')
}
```

## 🎯 最佳实践

### 1. 使用 STS 临时凭证

```typescript
// 从后端获取 STS 凭证
const stsConfig = await fetch('/api/sts-token')
  .then(res => res.json())

const uploader = createOSSUploader({
  region: stsConfig.region,
  accessKeyId: stsConfig.accessKeyId,
  accessKeySecret: stsConfig.accessKeySecret,
  bucket: stsConfig.bucket,
  stsToken: stsConfig.securityToken,
  expiration: stsConfig.expiration
})
```

### 2. 限制文件类型和大小

```typescript
const uploader = createOSSUploader(config, {
  allowedTypes: ['image/jpeg', 'image/png'],
  maxSize: 5 * 1024 * 1024 // 5MB
})
```

### 3. 显示上传进度

```typescript
const uploader = createOSSUploader(config, {
  onProgress: (progress) => {
    console.log(`上传进度: ${progress}%`)
  }
})
```

### 4. 错误处理

```typescript
try {
  const result = await uploader.uploadFile(file)
  
  if (!result.success) {
    throw new Error(result.error)
  }
  
  console.log('上传成功:', result.url)
} catch (error) {
  console.error('上传失败:', error.message)
  // 显示错误提示给用户
}
```

## 🐛 常见问题

### Q1: 上传时出现 CORS 错误

**A:** 请检查 OSS Bucket 的 CORS 配置是否正确。

### Q2: Access Key 泄露怎么办？

**A:** 立即在阿里云控制台禁用该 Access Key，并使用 STS 临时凭证。

### Q3: 上传速度慢怎么办？

**A:** 
- 选择离用户最近的 OSS 区域
- 使用 CDN 加速访问
- 压缩图片后再上传

### Q4: 如何限制上传文件的大小？

**A:** 在创建上传器时配置 `maxSize` 参数，或在 OSS 控制台配置 Bucket 的上传大小限制。

### Q5: 如何支持断点续传？

**A:** 使用 `ali-oss` SDK 的分片上传功能，或参考阿里云官方文档实现断点续传。

## 📚 相关文档

- **阿里云 OSS 官方文档**: [https://help.aliyun.com/product/31815.html](https://help.aliyun.com/product/31815.html)
- **OSS JavaScript SDK**: [https://github.com/ali-sdk/ali-oss](https://github.com/ali-sdk/ali-oss)
- **STS 临时凭证**: [https://help.aliyun.com/document_detail/100624.html](https://help.aliyun.com/document_detail/100624.html)
- **CORS 配置**: [https://help.aliyun.com/document_detail/31928.html](https://help.aliyun.com/document_detail/31928.html)

## 📝 更新日志

### v1.0.0 (2024-01-28)
- ✅ 初始版本
- ✅ 支持 OSS 前端直传
- ✅ 支持拖拽上传
- ✅ 支持图片预览
- ✅ 支持上传进度显示
- ✅ 集成到 property-editors
- ✅ 在 carousel 组件中使用

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
