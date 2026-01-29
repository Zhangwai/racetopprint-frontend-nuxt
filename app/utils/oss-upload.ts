// app/utils/oss-upload.ts
// OSS 前端直传工具类

import type { OSSConfig, OSSUploadResult } from '~/types/oss'

/**
 * OSS 配置接口
 */
export interface OSSConfig {
  region: string
  accessKeyId: string
  accessKeySecret: string
  bucket: string
  endpoint: string
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
 * 生成随机文件名
 */
const generateRandomFilename = (originalName: string): string => {
  const ext = originalName.split('.').pop() || ''
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 10)
  return `${timestamp}_${random}.${ext}`
}

/**
 * 生成 OSS 上传策略
 */
const generatePolicy = (expiration: number): string => {
  const date = new Date()
  date.setHours(date.getHours() + expiration)
  
  const policy = {
    expiration: date.toISOString(),
    conditions: [
      ['content-length-range', 0, 104857600], // 100MB
      ['starts-with', '$key', '']
    ]
  }
  
  return Buffer.from(JSON.stringify(policy)).toString('base64')
}

/**
 * 生成签名
 */
const generateSignature = (policy: string, accessKeySecret: string): string => {
  const crypto = require('crypto')
  return crypto.createHmac('sha1', accessKeySecret).update(policy).digest('base64')
}

/**
 * OSS 上传类
 */
export class OSSUploader {
  private config: OSSConfig
  private options: OSSUploadOptions

  constructor(config: OSSConfig, options: OSSUploadOptions = {}) {
    this.config = config
    this.options = {
      directory: 'uploads/',
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      ...options
    }
  }

  /**
   * 上传单个文件
   */
  async uploadFile(file: File, customFilename?: string): Promise<OSSUploadResult> {
    try {
      // 验证文件类型
      if (!this.options.allowedTypes!.includes(file.type)) {
        return {
          success: false,
          error: `不支持的文件类型: ${file.type}。支持的类型: ${this.options.allowedTypes!.join(', ')}`
        }
      }

      // 验证文件大小
      if (file.size > this.options.maxSize!) {
        return {
          success: false,
          error: `文件大小超过限制: ${(this.options.maxSize! / 1024 / 1024).toFixed(2)}MB`
        }
      }

      // 生成文件名
      const filename = customFilename || generateRandomFilename(file.name)
      const key = `${this.options.directory}${filename}`

      // 生成策略和签名
      const policy = generatePolicy(1) // 1小时有效期
      const signature = generateSignature(policy, this.config.accessKeySecret)

      // 构建表单数据
      const formData = new FormData()
      formData.append('key', key)
      formData.append('OSSAccessKeyId', this.config.accessKeyId)
      formData.append('policy', policy)
      formData.append('Signature', signature)
      formData.append('Content-Type', file.type)
      if (this.config.stsToken) {
        formData.append('x-oss-security-token', this.config.stsToken)
      }
      formData.append('file', file)

      // 上传到 OSS
      const endpoint = this.config.endpoint || `https://${this.config.bucket}.${this.config.region}.aliyuncs.com`
      const url = endpoint.startsWith('http') ? endpoint : `https://${endpoint}`

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`上传失败: ${response.status} ${response.statusText}`)
      }

      // 构建访问 URL
      const accessUrl = `${url}/${key}`

      return {
        success: true,
        url: accessUrl,
        filename,
        size: file.size
      }
    } catch (error) {
      console.error('OSS 上传失败:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '上传失败'
      }
    }
  }

  /**
   * 上传多个文件
   */
  async uploadFiles(files: FileList | File[], customFilenames?: string[]): Promise<OSSUploadResult[]> {
    const results: OSSUploadResult[] = []
    const fileArray = Array.isArray(files) ? files : Array.from(files)

    for (let i = 0; i < fileArray.length; i++) {
      const result = await this.uploadFile(fileArray[i], customFilenames?.[i])
      results.push(result)
    }

    return results
  }

  /**
   * 上传 Base64 图片
   */
  async uploadBase64(base64: string, filename?: string): Promise<OSSUploadResult> {
    try {
      // 解析 Base64
      const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)
      if (!matches || matches.length !== 3) {
        return { success: false, error: '无效的 Base64 格式' }
      }

      const mimeType = matches[1]
      const data = matches[2]

      // 转换为 Blob
      const byteString = atob(data)
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }

      const blob = new Blob([ab], { type: mimeType })
      const file = new File([blob], filename || generateRandomFilename('image.png'), { type: mimeType })

      return await this.uploadFile(file, filename)
    } catch (error) {
      console.error('Base64 上传失败:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Base64 上传失败'
      }
    }
  }

  /**
   * 删除文件
   */
  async deleteFile(url: string): Promise<boolean> {
    try {
      const key = url.split(this.config.bucket)[1]?.substring(1)
      if (!key) {
        console.error('无法解析文件路径')
        return false
      }

      const endpoint = this.config.endpoint || `https://${this.config.bucket}.${this.config.region}.aliyuncs.com`
      const deleteUrl = `${endpoint}/${key}`

      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `OSS ${this.config.accessKeyId}:${this.config.accessKeySecret}`
        }
      })

      return response.ok
    } catch (error) {
      console.error('删除文件失败:', error)
      return false
    }
  }
}

/**
 * 创建 OSS 上传实例
 */
export const createOSSUploader = (config: OSSConfig, options?: OSSUploadOptions): OSSUploader => {
  return new OSSUploader(config, options)
}

/**
 * 从后端获取 OSS 配置
 */
export const fetchOSSConfig = async (apiUrl: string): Promise<OSSConfig | null> => {
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`获取 OSS 配置失败: ${response.status}`)
    }

    const config = await response.json()
    return config as OSSConfig
  } catch (error) {
    console.error('获取 OSS 配置失败:', error)
    return null
  }
}

/**
 * 验证 OSS 配置
 */
export const validateOSSConfig = (config: OSSConfig): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!config.region) errors.push('region 不能为空')
  if (!config.accessKeyId) errors.push('accessKeyId 不能为空')
  if (!config.accessKeySecret) errors.push('accessKeySecret 不能为空')
  if (!config.bucket) errors.push('bucket 不能为空')

  return { valid: errors.length === 0, errors }
}
