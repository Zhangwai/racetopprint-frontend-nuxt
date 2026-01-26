// app/types/component-builder.ts

/**
 * 页面配置
 */
export interface PageConfig {
  id: string
  name: string
  slug: string
  title: string
  description: string
  keywords: string
  components: ComponentConfig[]
  status: 'draft' | 'published' | 'archived'
  templateId?: string
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  authorId: string
}

/**
 * 组件配置
 */
export interface ComponentConfig {
  id: string
  type: string
  props: Record<string, any>
  position: number
  style?: Record<string, any>
  customClass?: string
  conditions?: ComponentCondition[]
  animations?: ComponentAnimation[]
  createdAt: Date
  updatedAt: Date
}

/**
 * 组件定义
 */
export interface ComponentDefinition {
  type: string
  name: string
  icon: string
  description: string
  category: ComponentCategory
  defaultProps: Record<string, any>
  propertySchema: Record<string, PropertySchema>
  preview: string
  tags: string[]
}

/**
 * 组件分类
 */
export type ComponentCategory = 
  | 'layout'
  | 'content'
  | 'navigation'
  | 'promotion'
  | 'product'
  | 'custom'

/**
 * 属性 Schema
 */
export interface PropertySchema {
  type: 'string' | 'number' | 'boolean' | 'select' | 'image' | 'textarea' | 'color' | 'array' | 'object'
  label: string
  placeholder?: string
  default?: any
  min?: number
  max?: number
  options?: { value: any; label: string }[]
  rows?: number
  required?: boolean
  validation?: (value: any) => string | null
}

/**
 * 组件显示条件
 */
export interface ComponentCondition {
  type: 'user_role' | 'time_range' | 'device' | 'location' | 'custom'
  value: any
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains'
}

/**
 * 组件动画效果
 */
export interface ComponentAnimation {
  type: 'fade' | 'slide' | 'scale' | 'bounce' | 'custom'
  trigger: 'load' | 'scroll' | 'hover' | 'click'
  duration: number
  delay: number
  easing: string
}

/**
 * 模板配置
 */
export interface TemplateConfig {
  id: string
  name: string
  description: string
  thumbnail: string
  components: ComponentConfig[]
  category: 'home' | 'sale' | 'product' | 'custom'
  createdAt: Date
  authorId: string
}

/**
 * 页面版本
 */
export interface PageVersion {
  id: string
  pageId: string
  config: PageConfig
  version: number
  description: string
  createdAt: Date
}
