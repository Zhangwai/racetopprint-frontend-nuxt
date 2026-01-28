// app/composables/useComponentRegistry.ts
// 组件注册逻辑 - 负责组件的自动注册和管理

import type { ComponentDefinition } from "~/types/component-builder"
import { componentDirectories } from "~/components/builder/components/index"

// 定义组件目录结构
export interface ComponentDirectory {
  name: string // 目录名，也作为组件类型
  path: string // 相对路径
}

// 组件注册状态
interface ComponentRegistryState {
  definitions: ComponentDefinition[]
  configMap: Record<string, ComponentDefinition>
  imports: Record<string, () => Promise<{ default: any }>>
  initialized: boolean
}

// 全局注册状态
let registryState: ComponentRegistryState = {
  definitions: [],
  configMap: {},
  imports: {},
  initialized: false,
}

/**
 * 自动注册组件
 * 遍历组件目录，动态导入配置和组件
 */
export const autoRegisterComponents = async (
  componentDirectories: ComponentDirectory[]
): Promise<void> => {
  if (registryState.initialized) {
    return
  }

  for (const dir of componentDirectories) {
    try {
      // 动态导入配置
      const configModule = await import(
        /* @vite-ignore */
        `../components/${dir.path}/index.config.ts`
      )

      // 动态导入组件
      const importFn = () =>
        import(
          /* @vite-ignore */
          `../components/${dir.path}/index.vue`
        )

      const config =
        configModule[`${dir.name}Config`] ||
        (configModule.default as ComponentDefinition)

      if (config) {
        registryState.definitions.push(config)
        registryState.configMap[dir.name] = config
        registryState.imports[dir.name] = importFn
        console.log(`✓ Registered component: ${dir.name}`)
      }
    } catch (error) {
      console.warn(`Failed to register component "${dir.name}":`, error)
    }
  }

  registryState.initialized = true
}

/**
 * 获取所有组件定义
 */
export const getComponentDefinitions = (): ComponentDefinition[] => {
  return registryState.definitions
}

/**
 * 获取组件配置映射表
 */
export const getComponentConfigMap = (): Record<
  string,
  ComponentDefinition
> => {
  return registryState.configMap
}

/**
 * 获取组件导入映射表
 */
export const getComponentImports = (): Record<
  string,
  () => Promise<{ default: any }>
> => {
  return registryState.imports
}

/**
 * 获取组件元数据
 */
export const getComponentMetadata = (): ComponentMetadata[] => {
  return registryState.definitions.map((config) => ({
    type: config.type,
    name: config.name,
    icon: config.icon,
    description: config.description,
    category: config.category,
    config,
    loader: registryState.imports[config.type],
  }))
}

/**
 * 根据类型获取组件配置
 */
export const getComponentConfig = (
  type: string
): ComponentDefinition | undefined => {
  return registryState.configMap[type]
}

/**
 * 根据类型加载组件
 */
export const loadComponentByType = async (type: string): Promise<any> => {
  const loader = registryState.imports[type]
  if (!loader) {
    console.warn(`Component type "${type}" not found`)
    return null
  }
  try {
    const module = await loader()
    return module.default
  } catch (error) {
    console.error(`Failed to load component "${type}":`, error)
    return null
  }
}

/**
 * 检查组件是否已注册
 */
export const isComponentRegistered = (type: string): boolean => {
  return type in registryState.configMap
}

/**
 * 重置组件注册中心
 */
export const resetComponentRegistry = (): void => {
  registryState = {
    definitions: [],
    configMap: {},
    imports: {},
    initialized: false,
  }
}

/**
 * 获取注册状态
 */
export const getRegistryState = (): ComponentRegistryState => {
  return registryState
}

/**
 * 组件元数据
 * 包含组件的所有信息
 */
export interface ComponentMetadata {
  type: string
  name: string
  icon: string
  description: string
  category: string
  config: ComponentDefinition
  loader: () => Promise<{ default: any }>
}

// 向后兼容 - 旧的导出名称
export let componentDefinitions = getComponentDefinitions()
export let componentConfigMap = getComponentConfigMap()
export let componentImports = getComponentImports()
export const loadComponent = loadComponentByType

// 自动初始化组件注册
if (process.client) {
  autoRegisterComponents(componentDirectories).then(() => {
    // 更新向后兼容的导出名称
    componentDefinitions = getComponentDefinitions()
    componentConfigMap = getComponentConfigMap()
    componentImports = getComponentImports()
  })
}
