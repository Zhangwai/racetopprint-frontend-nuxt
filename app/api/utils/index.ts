// 处理 API 错误
export const handleApiError = (error: any): string => {
  if (error.response) {
    const { status, data } = error.response
    
    if (data && data.message) {
      return data.message
    }
    
    switch (status) {
      case 400:
        return '请求参数错误'
      case 401:
        return '未授权，请重新登录'
      case 403:
        return '禁止访问'
      case 404:
        return '请求资源不存在'
      case 422:
        return '数据验证失败'
      case 429:
        return '请求过于频繁，请稍后再试'
      case 500:
        return '服务器内部错误'
      default:
        return `请求错误: ${status}`
    }
  } else if (error.request) {
    return '网络连接失败，请检查网络'
  } else {
    return error.message || '请求失败'
  }
}

// 格式化价格
export const formatPrice = (price: number): string => {
  return `¥${price.toFixed(2)}`
}

// 格式化日期
export const formatDate = (date: string, format: string = 'YYYY-MM-DD'): string => {
  const d = new Date(date)
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

// 计算折扣
export const calculateDiscount = (originalPrice: number, discountPrice: number): number => {
  if (!originalPrice || originalPrice <= 0) return 0
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
}

// 检查活动状态
export const checkSaleStatus = (sale: {
  startDate: string
  endDate: string
}): 'active' | 'upcoming' | 'ended' => {
  const now = new Date()
  const start = new Date(sale.startDate)
  const end = new Date(sale.endDate)
  
  if (now < start) return 'upcoming'
  if (now > end) return 'ended'
  return 'active'
}

// 生成查询字符串
export const buildQueryString = (params: Record<string, any>): string => {
  const query = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value))
    }
  })
  
  return query.toString()
}

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// 本地存储工具
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Storage set error:', error)
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Storage remove error:', error)
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Storage clear error:', error)
    }
  }
}
