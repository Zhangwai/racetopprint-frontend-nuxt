// API 基础配置
const isDev = process.env.NODE_ENV === 'development'

// 根据环境设置不同的 baseURL
export const API_BASE_URL = isDev 
  ? 'http://localhost:3000/api' 
  : 'https://api.racetopprint.com'

// API 接口路径配置
export const API_PATHS = {
  // 认证相关
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    refreshToken: '/auth/refresh-token'
  },
  
  // 用户相关
  user: {
    profile: '/user/profile',
    update: '/user/update',
    avatar: '/user/avatar'
  },
  
  // 产品相关
  product: {
    list: '/products',
    detail: '/products/:id',
    categories: '/products/categories',
    search: '/products/search'
  },
  
  // 活动相关
  sale: {
    list: '/sales',
    detail: '/sales/:name',
    featured: '/sales/featured'
  },
  
  // 订单相关
  order: {
    list: '/orders',
    detail: '/orders/:id',
    create: '/orders',
    update: '/orders/:id',
    cancel: '/orders/:id/cancel'
  },
  
  // 购物车相关
  cart: {
    list: '/cart',
    add: '/cart',
    update: '/cart/:id',
    remove: '/cart/:id',
    clear: '/cart/clear'
  },
  
  // 文件上传
  upload: {
    file: '/upload/file',
    image: '/upload/image'
  }
}

// 请求超时时间（毫秒）
export const REQUEST_TIMEOUT = 10000

// 分页配置
export const PAGINATION = {
  defaultPage: 1,
  defaultPageSize: 20,
  maxPageSize: 100
}

// 缓存配置
export const CACHE_CONFIG = {
  enabled: true,
  maxAge: 5 * 60 * 1000, // 5分钟
  maxSize: 100
}
