export function useApi() {
  const runtimeConfig = useRuntimeConfig()
  const baseURL = runtimeConfig.public.apiBase || 'https://api.example.com'

  const request = async <T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const token = useCookie('token')
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    try {
      const response = await fetch(`${baseURL}${url}`, {
        ...options,
        headers
      })

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  const get = <T>(url: string, options?: RequestInit) => {
    return request<T>(url, { ...options, method: 'GET' })
  }

  const post = <T>(url: string, data?: any, options?: RequestInit) => {
    return request<T>(url, { ...options, method: 'POST', body: JSON.stringify(data) })
  }

  const put = <T>(url: string, data?: any, options?: RequestInit) => {
    return request<T>(url, { ...options, method: 'PUT', body: JSON.stringify(data) })
  }

  const del = <T>(url: string, options?: RequestInit) => {
    return request<T>(url, { ...options, method: 'DELETE' })
  }

  return {
    request,
    get,
    post,
    put,
    del,
    baseURL
  }
}
