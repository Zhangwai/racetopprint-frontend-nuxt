// app/types/oss.ts
// OSS 相关类型定义

/**
 * OSS 配置接口
 */
export interface OSSConfig {
  region: string
  accessKeyId: string
  accessKeySecret: string
  bucket: string
  endpoint?: string
  stsToken?: string
  expiration?: string
}

/**
 * OSS 上传结果接口
 */
export interface OSSUploadResult {
  success: boolean
  url?: string
  filename?: string
  size?: number
  error?: string
}

/**
 * OSS 上传配置接口
 */
export interface OSSUploadOptions {
  directory?: string
  maxSize?: number
  allowedTypes?: string[]
  onProgress?: (progress: number) => void
  onSuccess?: (result: OSSUploadResult) => void
  onError?: (error: Error) => void
}

/**
 * 图片上传组件 Props
 */
export interface ImageUploadProps {
  modelValue: string | null
  multiple?: boolean
  maxSize?: number
  allowedTypes?: string[]
  directory?: string
  placeholder?: string
  disabled?: boolean
}

/**
 * 图片上传组件 Emits
 */
export interface ImageUploadEmits {
  (e: 'update:modelValue', value: string | null): void
  (e: 'success', url: string): void
  (e: 'error', error: string): void
  (e: 'uploading', progress: number): void
}

/**
 * 图片预览接口
 */
export interface ImagePreview {
  url: string
  filename: string
  size: number
  uploadedAt: Date
}

/**
 * 上传状态接口
 */
export interface UploadStatus {
  uploading: boolean
  progress: number
  error: string | null
  success: boolean
}
