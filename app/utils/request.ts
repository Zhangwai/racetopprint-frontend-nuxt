import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type AxiosError
} from 'axios'

interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean
  showError?: boolean
}

interface ResponseData<T = any> {
  code: number
  message: string
  data: T
}

class HttpRequest {
  private instance: AxiosInstance
  private baseConfig: AxiosRequestConfig = {
    baseURL: '/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  }

  constructor(config?: AxiosRequestConfig) {
    this.instance = axios.create({
      ...this.baseConfig,
      ...config
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        // 添加 token
        const token = localStorage.getItem('token')
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // 显示加载动画（可选）
        if ((config as RequestConfig).showLoading !== false) {
          // 这里可以添加全局加载动画
          console.log('Loading...')
        }

        return config
      },
      (error: AxiosError): Promise<AxiosError> => {
        console.error('Request Error:', error)
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ResponseData>): AxiosResponse<ResponseData> => {
        const { data } = response

        // 处理业务错误
        if (data.code !== 200) {
          console.error('API Error:', data.message)
          
          // 这里可以添加全局错误提示
          if ((response.config as RequestConfig).showError !== false) {
            alert(data.message)
          }

          return Promise.reject(new Error(data.message))
        }

        return response
      },
      (error: AxiosError): Promise<AxiosError> => {
        console.error('Response Error:', error)

        // 处理 HTTP 错误
        if (error.response) {
          const { status } = error.response
          let errorMessage = '请求失败'

          switch (status) {
            case 401:
              errorMessage = '未授权，请重新登录'
              // 这里可以跳转到登录页
              break
            case 403:
              errorMessage = '禁止访问'
              break
            case 404:
              errorMessage = '请求资源不存在'
              break
            case 500:
              errorMessage = '服务器内部错误'
              break
            default:
              errorMessage = `请求错误: ${status}`
          }

          alert(errorMessage)
        } else if (error.request) {
          alert('网络连接失败，请检查网络')
        } else {
          alert('请求配置错误')
        }

        return Promise.reject(error)
      }
    )
  }

  public request<T = any>(config: RequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      this.instance
        .request<ResponseData<T>>(config)
        .then((response) => {
          resolve(response.data.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  public get<T = any>(url: string, params?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>({
      method: 'GET',
      url,
      params,
      ...config
    })
  }

  public post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
      ...config
    })
  }

  public put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
      ...config
    })
  }

  public delete<T = any>(url: string, params?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>({
      method: 'DELETE',
      url,
      params,
      ...config
    })
  }

  public patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
      ...config
    })
  }
}

// 创建默认实例
export const request = new HttpRequest()

// 导出类以便创建自定义实例
export { HttpRequest }

export type { RequestConfig, ResponseData }
