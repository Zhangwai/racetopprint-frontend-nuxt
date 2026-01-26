import { request } from '~/utils/request'
import { API_PATHS } from '../config'
import type { LoginResponse, RegisterResponse, UserProfile } from '../types'

// 用户登录
export const login = async (data: {
  username: string
  password: string
}): Promise<LoginResponse> => {
  return request.post<LoginResponse>(API_PATHS.auth.login, data)
}

// 用户注册
export const register = async (data: {
  username: string
  email: string
  password: string
  confirmPassword: string
}): Promise<RegisterResponse> => {
  return request.post<RegisterResponse>(API_PATHS.auth.register, data)
}

// 用户登出
export const logout = async (): Promise<void> => {
  return request.post<void>(API_PATHS.auth.logout)
}

// 刷新 Token
export const refreshToken = async (): Promise<{ token: string }> => {
  return request.post<{ token: string }>(API_PATHS.auth.refreshToken)
}

// 获取用户信息
export const getUserProfile = async (): Promise<UserProfile> => {
  return request.get<UserProfile>(API_PATHS.user.profile)
}

// 更新用户信息
export const updateUserProfile = async (
  data: Partial<UserProfile>
): Promise<UserProfile> => {
  return request.put<UserProfile>(API_PATHS.user.update, data)
}

// 上传用户头像
export const uploadUserAvatar = async (file: File): Promise<{ avatarUrl: string }> => {
  const formData = new FormData()
  formData.append('avatar', file)
  
  return request.post<{ avatarUrl: string }>(API_PATHS.user.avatar, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
