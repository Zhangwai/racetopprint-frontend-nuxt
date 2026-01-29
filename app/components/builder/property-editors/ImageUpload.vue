<template>
  <div class="image-upload" :class="{ disabled: disabled }">
    <!-- 上传区域 -->
    <div 
      class="upload-area"
      :class="{ 'has-image': modelValue }"
      @click="triggerUpload"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <!-- 已上传图片预览 -->
      <div v-if="modelValue" class="image-preview">
        <img :src="modelValue" :alt="'预览'" />
        <div class="image-overlay">
          <button class="overlay-btn" @click.stop="removeImage">
            🗑️ 删除
          </button>
          <button class="overlay-btn primary" @click.stop="triggerUpload">
            🔄 更换
          </button>
        </div>
      </div>

      <!-- 上传提示 -->
      <div v-else class="upload-prompt">
        <div class="upload-icon">📷</div>
        <p class="upload-text">{{ placeholder }}</p>
        <p class="upload-hint">支持 JPG、PNG、GIF、WebP 格式，最大 {{ formatFileSize(maxSize) }}</p>
      </div>

      <!-- 上传进度 -->
      <div v-if="uploadStatus.uploading" class="upload-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :style="{ width: `${uploadStatus.progress}%` }"
          ></div>
        </div>
        <p class="progress-text">上传中... {{ uploadStatus.progress }}%</p>
      </div>

      <!-- 错误提示 -->
      <div v-if="uploadStatus.error" class="upload-error">
        <span class="error-icon">❌</span>
        <span class="error-text">{{ uploadStatus.error }}</span>
      </div>
    </div>

    <!-- 文件输入框（隐藏） -->
    <input 
      ref="fileInput"
      type="file"
      :accept="allowedTypes.join(',')"
      :multiple="multiple"
      style="display: none"
      @change="handleFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { createOSSUploader, validateOSSConfig } from '~/utils/oss-upload'

// Props
const props = withDefaults(defineProps<{
  modelValue: string | null
  multiple?: boolean
  maxSize?: number
  allowedTypes?: string[]
  directory?: string
  placeholder?: string
  disabled?: boolean
}>(), {
  multiple: false,
  maxSize: 10 * 1024 * 1024,
  allowedTypes: () => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  directory: 'uploads/images/',
  placeholder: '点击或拖拽上传图片',
  disabled: false
})

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'success', url: string): void
  (e: 'error', error: string): void
  (e: 'uploading', progress: number): void
}>()

// Refs
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

// 上传状态
const uploadStatus = reactive({
  uploading: false,
  progress: 0,
  error: null as string | null,
  success: false
})

// OSS 配置（从环境变量或后端获取）
const ossConfig = computed(() => ({
  region: import.meta.env.OSS_REGION || 'oss-cn-hangzhou',
  accessKeyId: import.meta.env.OSS_ACCESS_KEY_ID || '',
  accessKeySecret: import.meta.env.OSS_ACCESS_KEY_SECRET || '',
  bucket: import.meta.env.OSS_BUCKET || '',
  endpoint: import.meta.env.OSS_ENDPOINT || ''
}))

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

// 触发上传
const triggerUpload = () => {
  if (props.disabled) return
  fileInput.value?.click()
}

// 处理文件选择
const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (files && files.length > 0) {
    await uploadFiles(files)
  }
  
  // 重置输入框以支持重复选择同一文件
  target.value = ''
}

// 处理拖拽上传
const handleDrop = async (event: DragEvent) => {
  if (props.disabled) return
  
  isDragging.value = false
  const files = event.dataTransfer?.files
  
  if (files && files.length > 0) {
    await uploadFiles(files)
  }
}

// 上传文件
const uploadFiles = async (files: FileList | File[]) => {
  // 验证 OSS 配置
  const validation = validateOSSConfig(ossConfig.value)
  if (!validation.valid) {
    uploadStatus.error = validation.errors.join(', ')
    emit('error', validation.errors.join(', '))
    return
  }

  // 创建 OSS 上传器
  const uploader = createOSSUploader(ossConfig.value, {
    directory: props.directory,
    maxSize: props.maxSize,
    allowedTypes: props.allowedTypes,
    onProgress: (progress: number) => {
      uploadStatus.progress = progress
      emit('uploading', progress)
    }
  })

  // 上传文件
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    // 重置状态
    uploadStatus.uploading = true
    uploadStatus.progress = 0
    uploadStatus.error = null
    uploadStatus.success = false

    try {
      const result = await uploader.uploadFile(file)
      
      if (result.success && result.url) {
        emit('update:modelValue', result.url)
        emit('success', result.url)
        uploadStatus.success = true
        uploadStatus.uploading = false
        
        // 如果不是多图模式，只上传第一张
        if (!props.multiple) break
      } else {
        uploadStatus.error = result.error || '上传失败'
        emit('error', result.error || '上传失败')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '上传失败'
      uploadStatus.error = errorMessage
      emit('error', errorMessage)
    }
  }

  uploadStatus.uploading = false
}

// 删除图片
const removeImage = () => {
  emit('update:modelValue', null)
  uploadStatus.success = false
}
</script>

<style scoped>
.image-upload {
  width: 100%;
  border: 2px dashed #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.image-upload:hover {
  border-color: #667eea;
  box-shadow: 0 0 12px rgba(102, 126, 234, 0.2);
}

.image-upload.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.image-upload.disabled .upload-area {
  cursor: not-allowed;
}

/* 上传区域 */
.upload-area {
  position: relative;
  width: 100%;
  cursor: pointer;
  background: #f9f9f9;
  transition: all 0.3s ease;
}

.upload-area:hover {
  background: #f0f0f0;
}

.upload-area.has-image {
  background: transparent;
}

/* 图片预览 */
.image-preview {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 比例 */
  overflow: hidden;
}

.image-preview img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.overlay-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.overlay-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.overlay-btn.primary {
  background: #667eea;
  border-color: #667eea;
}

.overlay-btn.primary:hover {
  background: #5568d3;
}

/* 上传提示 */
.upload-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  gap: 16px;
}

.upload-icon {
  font-size: 48px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.upload-text {
  font-size: 16px;
  color: #666;
  margin: 0;
  font-weight: 500;
}

.upload-hint {
  font-size: 12px;
  color: #999;
  margin: 0;
}

/* 上传进度 */
.upload-progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.progress-bar {
  width: 80%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 错误提示 */
.upload-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(239, 68, 68, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #dc2626;
}

.error-icon {
  font-size: 32px;
}

.error-text {
  font-size: 14px;
  text-align: center;
  padding: 0 20px;
}

/* 拖拽状态 */
.upload-area.dragging {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}
</style>