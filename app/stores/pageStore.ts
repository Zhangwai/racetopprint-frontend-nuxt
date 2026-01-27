// app/stores/pageStore.ts

import { defineStore } from 'pinia'
import type { PageConfig, ComponentConfig } from '~/types/component-builder'

/**
 * 页面管理 Pinia Store
 * 用于管理页面的创建、保存、加载、发布等操作
 */
export const usePageStore = defineStore('page', {
  state: () => ({
    currentPage: null as PageConfig | null,
    pages: [] as PageConfig[],
    isLoading: false,
    isSaving: false
  }),

  // 启用持久化
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'page_store',
        storage: {
          getItem: (key: string) => {
            if (process.client) {
              try {
                return JSON.parse(window.localStorage.getItem(key) || 'null')
              } catch {
                return null
              }
            }
            return null
          },
          setItem: (key: string, value: any) => {
            if (process.client) {
              window.localStorage.setItem(key, JSON.stringify(value))
            }
          },
          removeItem: (key: string) => {
            if (process.client) {
              window.localStorage.removeItem(key)
            }
          },
        },
        // 只持久化 pages 状态
        paths: ['pages']
      }
    ]
  },

  getters: {
    // 获取所有非归档页面
    activePages: (state) => {
      return state.pages.filter(p => p.status !== 'archived')
    },

    // 获取已发布页面
    publishedPages: (state) => {
      return state.pages.filter(p => p.status === 'published')
    },

    // 获取草稿页面
    draftPages: (state) => {
      return state.pages.filter(p => p.status === 'draft')
    }
  },

  actions: {
    /**
     * 初始化页面列表
     */
    async initPages() {
      this.isLoading = true
      try {
        // 检查是否有持久化的数据
        if (this.pages.length > 0) {
          console.log('📦 使用持久化的页面数据')
          return
        }

        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 模拟页面数据（实际项目中应该从 API 获取）
        const mockPages: PageConfig[] = [
          {
            id: '1',
            name: '首页',
            slug: 'home',
            title: '我的商城 - 首页',
            description: '欢迎来到我的商城',
            keywords: '商城,购物,商品',
            components: [],
            status: 'archived',
            createdAt: new Date('2026-01-20'),
            updatedAt: new Date('2026-01-25'),
            publishedAt: new Date('2026-01-25'),
            authorId: '1'
          },
          {
            id: '2',
            name: '商品列表页',
            slug: 'products',
            title: '我的商城 - 商品列表',
            description: '浏览我们的商品',
            keywords: '商品,列表,购物',
            components: [],
            status: 'draft',
            createdAt: new Date('2026-01-22'),
            updatedAt: new Date('2026-01-26'),
            authorId: '1'
          },
          {
            id: '3',
            name: '关于我们',
            slug: 'about',
            title: '我的商城 - 关于我们',
            description: '了解我们的公司',
            keywords: '关于我们,公司简介',
            components: [],
            status: 'published',
            createdAt: new Date('2026-01-24'),
            updatedAt: new Date('2026-01-25'),
            publishedAt: new Date('2026-01-25'),
            authorId: '1'
          }
        ]

        this.pages = [...mockPages]
      } catch (error) {
        console.error('Failed to load pages:', error)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * 创建新页面
     */
    async createPage(pageData: {
      name: string
      slug: string
      title: string
      description?: string
      keywords?: string
    }): Promise<PageConfig> {
      const newPage: PageConfig = {
        id: Date.now().toString(),
        name: pageData.name,
        slug: pageData.slug,
        title: pageData.title,
        description: pageData.description || '',
        keywords: pageData.keywords || '',
        components: [],
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: '1' // 实际项目中应该从用户信息获取
      }

      try {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 500))
        this.pages.push(newPage)
        return newPage
      } catch (error) {
        console.error('Failed to create page:', error)
        throw error
      }
    },

    /**
     * 加载页面
     */
    async loadPage(pageId: string): Promise<PageConfig | null> {
      this.isLoading = true
      try {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 500))
        const page = this.pages.find(p => p.id === pageId)
        if (page) {
          this.currentPage = { ...page }
          return this.currentPage
        }
        return null
      } catch (error) {
        console.error('Failed to load page:', error)
        return null
      } finally {
        this.isLoading = false
      }
    },

    /**
     * 保存页面
     */
    async savePage(pageId: string, pageData: Partial<PageConfig>): Promise<PageConfig | null> {
      this.isSaving = true
      try {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const pageIndex = this.pages.findIndex(p => p.id === pageId)
        if (pageIndex !== -1) {
          this.pages[pageIndex] = {
            ...this.pages[pageIndex],
            ...pageData,
            updatedAt: new Date()
          }
          
          if (this.currentPage && this.currentPage.id === pageId) {
            this.currentPage = this.pages[pageIndex]
          }
          
          return this.pages[pageIndex]
        }
        
        return null
      } catch (error) {
        console.error('Failed to save page:', error)
        throw error
      } finally {
        this.isSaving = false
      }
    },

    /**
     * 发布页面
     */
    async publishPage(pageId: string): Promise<PageConfig | null> {
      try {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const pageIndex = this.pages.findIndex(p => p.id === pageId)
        if (pageIndex !== -1) {
          this.pages[pageIndex] = {
            ...this.pages[pageIndex],
            status: 'published' as const,
            publishedAt: new Date(),
            updatedAt: new Date()
          }
          
          if (this.currentPage && this.currentPage.id === pageId) {
            this.currentPage = this.pages[pageIndex]
          }
          
          return this.pages[pageIndex]
        }
        
        return null
      } catch (error) {
        console.error('Failed to publish page:', error)
        throw error
      }
    },

    /**
     * 取消发布页面
     */
    async unpublishPage(pageId: string): Promise<PageConfig | null> {
      try {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const pageIndex = this.pages.findIndex(p => p.id === pageId)
        if (pageIndex !== -1) {
          this.pages[pageIndex] = {
            ...this.pages[pageIndex],
            status: 'draft' as const,
            updatedAt: new Date()
          }
          
          if (this.currentPage && this.currentPage.id === pageId) {
            this.currentPage = this.pages[pageIndex]
          }
          
          return this.pages[pageIndex]
        }
        
        return null
      } catch (error) {
        console.error('Failed to unpublish page:', error)
        throw error
      }
    },

    /**
     * 归档页面
     */
    async archivePage(pageId: string): Promise<PageConfig | null> {
      try {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const pageIndex = this.pages.findIndex(p => p.id === pageId)
        if (pageIndex !== -1) {
          this.pages[pageIndex] = {
            ...this.pages[pageIndex],
            status: 'archived' as const,
            updatedAt: new Date()
          }
          
          if (this.currentPage && this.currentPage.id === pageId) {
            this.currentPage = null
          }
          
          return this.pages[pageIndex]
        }
        
        return null
      } catch (error) {
        console.error('Failed to archive page:', error)
        throw error
      }
    },

    /**
     * 添加组件到页面
     */
    async addComponent(pageId: string, component: ComponentConfig): Promise<ComponentConfig | null> {
      try {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const pageIndex = this.pages.findIndex(p => p.id === pageId)
        if (pageIndex !== -1) {
          this.pages[pageIndex].components.push(component)
          this.pages[pageIndex].updatedAt = new Date()
          
          if (this.currentPage && this.currentPage.id === pageId) {
            this.currentPage.components.push(component)
            this.currentPage.updatedAt = new Date()
          }
          
          return component
        }
        
        return null
      } catch (error) {
        console.error('Failed to add component:', error)
        throw error
      }
    },

    /**
     * 更新页面组件
     */
    async updateComponent(pageId: string, componentId: string, componentData: Partial<ComponentConfig>): Promise<ComponentConfig | null> {
      try {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const pageIndex = this.pages.findIndex(p => p.id === pageId)
        if (pageIndex !== -1) {
          const componentIndex = this.pages[pageIndex].components.findIndex(c => c.id === componentId)
          if (componentIndex !== -1) {
            this.pages[pageIndex].components[componentIndex] = {
              ...this.pages[pageIndex].components[componentIndex],
              ...componentData,
              updatedAt: new Date()
            }
            this.pages[pageIndex].updatedAt = new Date()
            
            if (this.currentPage && this.currentPage.id === pageId) {
              const currentComponentIndex = this.currentPage.components.findIndex(c => c.id === componentId)
              if (currentComponentIndex !== -1) {
                this.currentPage.components[currentComponentIndex] = this.pages[pageIndex].components[componentIndex]
              }
              this.currentPage.updatedAt = new Date()
            }
            
            return this.pages[pageIndex].components[componentIndex]
          }
        }
        
        return null
      } catch (error) {
        console.error('Failed to update component:', error)
        throw error
      }
    },

    /**
     * 删除页面组件
     */
    async removeComponent(pageId: string, componentId: string): Promise<boolean> {
      try {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const pageIndex = this.pages.findIndex(p => p.id === pageId)
        if (pageIndex !== -1) {
          const componentIndex = this.pages[pageIndex].components.findIndex(c => c.id === componentId)
          if (componentIndex !== -1) {
            this.pages[pageIndex].components.splice(componentIndex, 1)
            this.pages[pageIndex].updatedAt = new Date()
            
            if (this.currentPage && this.currentPage.id === pageId) {
              const currentComponentIndex = this.currentPage.components.findIndex(c => c.id === componentId)
              if (currentComponentIndex !== -1) {
                this.currentPage.components.splice(currentComponentIndex, 1)
              }
              this.currentPage.updatedAt = new Date()
            }
            
            return true
          }
        }
        
        return false
      } catch (error) {
        console.error('Failed to remove component:', error)
        throw error
      }
    },

    /**
     * 重新排序页面组件
     */
    async reorderComponents(pageId: string, componentIds: string[]): Promise<boolean> {
      try {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const pageIndex = this.pages.findIndex(p => p.id === pageId)
        if (pageIndex !== -1) {
          const sortedComponents = componentIds.map(id => 
            this.pages[pageIndex].components.find(c => c.id === id)
          ).filter((c): c is ComponentConfig => c !== undefined)
          
          this.pages[pageIndex].components = sortedComponents
          this.pages[pageIndex].updatedAt = new Date()
          
          if (this.currentPage && this.currentPage.id === pageId) {
            this.currentPage.components = sortedComponents
            this.currentPage.updatedAt = new Date()
          }
          
          return true
        }
        
        return false
      } catch (error) {
        console.error('Failed to reorder components:', error)
        throw error
      }
    }
  }
})
