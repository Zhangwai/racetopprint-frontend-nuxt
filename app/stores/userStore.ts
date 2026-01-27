// app/stores/userStore.ts

import { defineStore } from 'pinia'

/**
 * 用户信息 Store
 * 自动持久化到 localStorage
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    // 用户基本信息
    id: null as string | null,
    name: '',
    email: '',
    avatar: '',
    token: '',

    // 用户设置
    settings: {
      theme: 'light' as 'light' | 'dark' | 'auto',
      language: 'zh-CN' as 'zh-CN' | 'en-US',
      notifications: true,
      emailNotifications: true,
    },

    // 临时状态（不需要持久化）
    isLoggedIn: false,
    isLoading: false,
  }),

  // 自动持久化配置
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user_store',
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
        // 只持久化需要保存的字段
        paths: [
          'id',
          'name',
          'email',
          'avatar',
          'token',
          'settings',
        ],
      },
    ],
  },

  getters: {
    // 获取用户显示名称
    displayName: (state) => {
      return state.name || '未登录用户'
    },

    // 获取头像 URL
    avatarUrl: (state) => {
      return state.avatar || '/default-avatar.png'
    },

    // 是否为管理员（示例）
    isAdmin: (state) => {
      return state.email === 'admin@example.com'
    },

    // 获取完整的用户信息
    userInfo: (state) => {
      return {
        id: state.id,
        name: state.name,
        email: state.email,
        avatar: state.avatar,
        settings: state.settings,
      }
    },
  },

  actions: {
    /**
     * 登录
     */
    async login(credentials: { email: string; password: string }) {
      this.isLoading = true
      try {
        // 模拟 API 调用
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // 模拟登录成功
        const mockUser = {
          id: 'user_123456',
          name: credentials.email.split('@')[0],
          email: credentials.email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
          token: 'mock_token_' + Date.now(),
        }

        // 更新状态
        this.id = mockUser.id
        this.name = mockUser.name
        this.email = mockUser.email
        this.avatar = mockUser.avatar
        this.token = mockUser.token
        this.isLoggedIn = true

        console.log('✅ 登录成功，用户信息已持久化')
        return true
      } catch (error) {
        console.error('❌ 登录失败:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * 登出
     */
    async logout() {
      try {
        // 模拟 API 调用
        await new Promise((resolve) => setTimeout(resolve, 500))

        // 清除用户信息
        this.id = null
        this.name = ''
        this.email = ''
        this.avatar = ''
        this.token = ''
        this.isLoggedIn = false

        console.log('✅ 登出成功，用户信息已清除')
      } catch (error) {
        console.error('❌ 登出失败:', error)
        throw error
      }
    },

    /**
     * 更新用户信息
     */
    async updateUserInfo(userData: Partial<{
      name: string
      email: string
      avatar: string
    }>) {
      this.isLoading = true
      try {
        // 模拟 API 调用
        await new Promise((resolve) => setTimeout(resolve, 500))

        // 更新状态
        if (userData.name !== undefined) this.name = userData.name
        if (userData.email !== undefined) this.email = userData.email
        if (userData.avatar !== undefined) this.avatar = userData.avatar

        console.log('✅ 用户信息已更新')
        return true
      } catch (error) {
        console.error('❌ 更新用户信息失败:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * 更新用户设置
     */
    async updateSettings(settings: Partial<{
      theme: 'light' | 'dark' | 'auto'
      language: 'zh-CN' | 'en-US'
      notifications: boolean
      emailNotifications: boolean
    }>) {
      try {
        // 模拟 API 调用
        await new Promise((resolve) => setTimeout(resolve, 300))

        // 更新设置
        this.settings = { ...this.settings, ...settings }

        console.log('✅ 用户设置已更新')
        return true
      } catch (error) {
        console.error('❌ 更新用户设置失败:', error)
        throw error
      }
    },

    /**
     * 切换主题
     */
    toggleTheme() {
      const themes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto']
      const currentIndex = themes.indexOf(this.settings.theme)
      this.settings.theme = themes[(currentIndex + 1) % themes.length]
      console.log('🎨 主题已切换为:', this.settings.theme)
    },

    /**
     * 初始化用户信息（从持久化数据恢复）
     */
    initUser() {
      if (this.token && this.id) {
        this.isLoggedIn = true
        console.log('📦 用户信息已从持久化数据恢复')
      }
    },
  },
})
