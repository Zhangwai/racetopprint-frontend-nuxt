// app/composables/useUserManager.ts

import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'

/**
 * 用户管理 Composable
 * 提供用户登录、登出、信息更新等功能
 * 内部使用 Pinia Store，自动持久化
 */
export const useUserManager = () => {
  const userStore = useUserStore()

  // 使用 storeToRefs 保持响应性
  const {
    id,
    name,
    email,
    avatar,
    token,
    settings,
    isLoggedIn,
    isLoading,
  } = storeToRefs(userStore)

  // Actions
  const login = async (credentials: { email: string; password: string }) => {
    return await userStore.login(credentials)
  }

  const logout = async () => {
    return await userStore.logout()
  }

  const updateUserInfo = async (userData: Partial<{
    name: string
    email: string
    avatar: string
  }>) => {
    return await userStore.updateUserInfo(userData)
  }

  const updateSettings = async (newSettings: Partial<{
    theme: 'light' | 'dark' | 'auto'
    language: 'zh-CN' | 'en-US'
    notifications: boolean
    emailNotifications: boolean
  }>) => {
    return await userStore.updateSettings(newSettings)
  }

  const toggleTheme = () => {
    userStore.toggleTheme()
  }

  const initUser = () => {
    userStore.initUser()
  }

  return {
    // 响应式状态
    id,
    name,
    email,
    avatar,
    token,
    settings,
    isLoggedIn,
    isLoading,

    // Getters
    displayName: userStore.displayName,
    avatarUrl: userStore.avatarUrl,
    isAdmin: userStore.isAdmin,
    userInfo: userStore.userInfo,

    // Actions
    login,
    logout,
    updateUserInfo,
    updateSettings,
    toggleTheme,
    initUser,

    // Store 实例
    store: userStore,
  }
}
