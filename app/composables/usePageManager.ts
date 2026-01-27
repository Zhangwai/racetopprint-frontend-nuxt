// app/composables/usePageManager.ts

import { storeToRefs } from "pinia"
import { usePageStore } from "@/stores/pageStore"
import type { PageConfig, ComponentConfig } from "~/types/component-builder"

/**
 * 页面管理 Composable
 * 用于管理页面的创建、保存、加载、发布等操作
 * 内部使用 Pinia Store 进行状态管理
 */
export const usePageManager = () => {
  const pageStore = usePageStore()

  // 使用 storeToRefs 保持响应性
  // 直接返回 store 的响应式属性
  const {
    currentPage,
    pages,
    isLoading,
    isSaving,
    activePages,
    publishedPages,
    draftPages,
  } = storeToRefs(pageStore)
  /**
   * 初始化页面列表
   */
  const initPages = async () => {
    await pageStore.initPages()
  }

  /**
   * 创建新页面
   */
  const createPage = async (pageData: {
    name: string
    slug: string
    title: string
    description?: string
    keywords?: string
  }): Promise<PageConfig> => {
    return await pageStore.createPage(pageData)
  }

  /**
   * 加载页面
   */
  const loadPage = async (pageId: string): Promise<PageConfig | null> => {
    return await pageStore.loadPage(pageId)
  }

  /**
   * 保存页面
   */
  const savePage = async (
    pageId: string,
    pageData: Partial<PageConfig>
  ): Promise<PageConfig | null> => {
    return await pageStore.savePage(pageId, pageData)
  }

  /**
   * 发布页面
   */
  const publishPage = async (pageId: string): Promise<PageConfig | null> => {
    return await pageStore.publishPage(pageId)
  }

  /**
   * 取消发布页面
   */
  const unpublishPage = async (pageId: string): Promise<PageConfig | null> => {
    return await pageStore.unpublishPage(pageId)
  }

  /**
   * 归档页面
   */
  const archivePage = async (pageId: string): Promise<PageConfig | null> => {
    return await pageStore.archivePage(pageId)
  }

  /**
   * 添加组件到页面
   */
  const addComponent = async (
    pageId: string,
    component: ComponentConfig
  ): Promise<ComponentConfig | null> => {
    return await pageStore.addComponent(pageId, component)
  }

  /**
   * 更新页面组件
   */
  const updateComponent = async (
    pageId: string,
    componentId: string,
    componentData: Partial<ComponentConfig>
  ): Promise<ComponentConfig | null> => {
    return await pageStore.updateComponent(pageId, componentId, componentData)
  }

  /**
   * 删除页面组件
   */
  const removeComponent = async (
    pageId: string,
    componentId: string
  ): Promise<boolean> => {
    return await pageStore.removeComponent(pageId, componentId)
  }

  /**
   * 重新排序页面组件
   */
  const reorderComponents = async (
    pageId: string,
    componentIds: string[]
  ): Promise<boolean> => {
    return await pageStore.reorderComponents(pageId, componentIds)
  }

  return {
    // 响应式状态（直接来自 storeToRefs）
    currentPage,
    pages,
    isLoading,
    isSaving,
    activePages,
    publishedPages,
    draftPages,
    
    // Actions
    initPages,
    createPage,
    loadPage,
    savePage,
    publishPage,
    unpublishPage,
    archivePage,
    addComponent,
    updateComponent,
    removeComponent,
    reorderComponents,

    // Store 实例（用于高级操作）
    store: pageStore,
  }
}
