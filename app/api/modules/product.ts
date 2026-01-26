import { request } from '~/utils/request'
import { API_PATHS } from '../config'
import type { Product, ProductListResponse, ProductDetailResponse } from '../types'

// 获取产品列表
export const getProductList = async (params?: {
  page?: number
  pageSize?: number
  category?: string
  search?: string
  sort?: string
}): Promise<ProductListResponse> => {
  return request.get<ProductListResponse>(API_PATHS.product.list, params)
}

// 获取产品详情
export const getProductDetail = async (id: string | number): Promise<ProductDetailResponse> => {
  const url = API_PATHS.product.detail.replace(':id', id.toString())
  return request.get<ProductDetailResponse>(url)
}

// 获取产品分类
export const getProductCategories = async (): Promise<string[]> => {
  return request.get<string[]>(API_PATHS.product.categories)
}

// 搜索产品
export const searchProducts = async (keyword: string): Promise<Product[]> => {
  return request.get<Product[]>(API_PATHS.product.search, { q: keyword })
}

// 创建产品（管理员）
export const createProduct = async (data: FormData): Promise<Product> => {
  return request.post<Product>(API_PATHS.product.list, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 更新产品（管理员）
export const updateProduct = async (
  id: string | number,
  data: Partial<Product>
): Promise<Product> => {
  const url = API_PATHS.product.detail.replace(':id', id.toString())
  return request.put<Product>(url, data)
}

// 删除产品（管理员）
export const deleteProduct = async (id: string | number): Promise<void> => {
  const url = API_PATHS.product.detail.replace(':id', id.toString())
  return request.delete<void>(url)
}
