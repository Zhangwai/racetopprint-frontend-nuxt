// app/components/builder/components/index.ts
// 组件注册中心 - 统一管理所有组件的配置和导入

import type { ComponentDefinition } from "~/types/component-builder"

// Banner 组件
import { bannerConfig } from "./banner/index.config"
export { bannerConfig } from "./banner/index.config"
export { default as BannerComponent } from "./banner/index.vue"

// Carousel 组件
import { carouselConfig } from "./carousel/index.config"
export { carouselConfig } from "./carousel/index.config"
export { default as CarouselComponent } from "./carousel/index.vue"

// ProductList 组件
import { productListConfig } from "./product-list/index.config"
export { productListConfig } from "./product-list/index.config"
export { default as ProductListComponent } from "./product-list/index.vue"

// Navbar 组件
import { navbarConfig } from "./navbar/index.config"
export { navbarConfig } from "./navbar/index.config"
export { default as NavbarComponent } from "./navbar/index.vue"

/**
 * 所有组件配置列表
 * 用于在 Builder 页面中显示组件库
 */
export const componentDefinitions: ComponentDefinition[] = [
  bannerConfig,
  carouselConfig,
  productListConfig,
  navbarConfig,
]

/**
 * 组件配置映射表
 * 用于根据组件类型快速查找配置
 */
export const componentConfigMap: Record<string, ComponentDefinition> = {
  banner: bannerConfig,
  carousel: carouselConfig,
  "product-list": productListConfig,
  navbar: navbarConfig,
}

/**
 * 组件导入映射表
 * 用于动态加载组件
 */
export const componentImports: Record<string, () => Promise<{ default: any }>> =
  {
    banner: () => import("./banner/index.vue"),
    carousel: () => import("./carousel/index.vue"),
    "product-list": () => import("./product-list/index.vue"),
    navbar: () => import("./navbar/index.vue"),
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
