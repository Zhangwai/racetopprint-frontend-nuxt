// app/components/builder/components/index.ts
// 组件注册中心 - 统一管理所有组件的配置和导入

import type { ComponentDefinition } from "~/types/component-builder"

// 定义组件目录结构
export interface ComponentDirectory {
  name: string // 目录名，也作为组件类型
  path: string // 相对路径
}

// 所有组件目录列表 - 这里只需维护目录名即可
const componentDirectories: ComponentDirectory[] = [
  { name: "banner", path: "./banner" },
  { name: "carousel", path: "./carousel" },
  { name: "product-list", path: "./product-list" },
  { name: "navbar", path: "./navbar" },
  // 添加新组件时只需在这里添加目录名
]
// 存储所有组件的配置和导入
export const componentDefinitions: ComponentDefinition[] = []
export const componentConfigMap: Record<string, ComponentDefinition> = {}
export const componentImports: Record<string, () => Promise<{ default: any }>> =
  {}
/**
 * 自动注册组件
 * 遍历组件目录，动态导入配置和组件
 */
export const autoRegisterComponents = async (): Promise<void> => {
  for (const dir of componentDirectories) {
    try {
      // 动态导入配置
      const configModule = await import(
        /* @vite-ignore */
        `${dir.path}/index.config.ts`
      )

      // 动态导入组件
      const importFn = () =>
        import(
          /* @vite-ignore */
          `${dir.path}/index.vue`
        )

      const config =
        configModule[`${dir.name}Config`] ||
        (configModule.default as ComponentDefinition)

      if (config) {
        componentDefinitions.push(config)
        componentConfigMap[dir.name] = config
        componentImports[dir.name] = importFn
        console.log(`✓ Registered component: ${dir.name}`)
      }
    } catch (error) {
      console.warn(`Failed to register component "${dir.name}":`, error)
    }
  }
}
autoRegisterComponents()
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

/**
 * 获取所有组件的元数据
 */
export const getComponentMetadata = (): ComponentMetadata[] => {
  return componentDefinitions.map((config) => ({
    type: config.type,
    name: config.name,
    icon: config.icon,
    description: config.description,
    category: config.category,
    config,
    loader: componentImports[config.type],
  }))
}

/**
 * 根据类型获取组件配置
 */
export const getComponentConfig = (
  type: string
): ComponentDefinition | undefined => {
  return componentConfigMap[type]
}

/**
 * 根据类型加载组件
 */
export const loadComponent = async (type: string): Promise<any> => {
  const loader = componentImports[type]
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
 * 注册新组件
 * @param type 组件类型
 * @param config 组件配置
 * @param loader 组件加载器
 */
export const registerComponent = (
  type: string,
  config: ComponentDefinition,
  loader: () => Promise<{ default: any }>
): void => {
  componentDefinitions.push(config)
  componentConfigMap[type] = config
  componentImports[type] = loader
}

/**
 * 获取所有组件类型
 */
export const getComponentTypes = (): string[] => {
  return Object.keys(componentConfigMap)
}

/**
 * 根据分类筛选组件
 */
export const getComponentsByCategory = (
  category: string
): ComponentDefinition[] => {
  return componentDefinitions.filter((config) => config.category === category)
}

/**
 * 获取所有组件分类
 */
export const getComponentCategories = (): string[] => {
  const categories = new Set<string>()
  componentDefinitions.forEach((config) => {
    categories.add(config.category)
  })
  return Array.from(categories)
}
