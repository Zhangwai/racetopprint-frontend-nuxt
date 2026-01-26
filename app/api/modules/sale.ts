import { request } from '~/utils/request'
import { API_PATHS } from '../config'
import type { Sale, SaleListResponse, SaleDetailResponse } from '../types'

// 获取活动列表
export const getSaleList = async (params?: {
  page?: number
  pageSize?: number
  status?: 'active' | 'upcoming' | 'ended'
  sort?: string
}): Promise<SaleListResponse> => {
  return request.get<SaleListResponse>(API_PATHS.sale.list, params)
}

// 获取活动详情
export const getSaleDetail = async (name: string): Promise<SaleDetailResponse> => {
  const url = API_PATHS.sale.detail.replace(':name', name)
  return request.get<SaleDetailResponse>(url)
}

// 获取推荐活动
export const getFeaturedSales = async (limit: number = 3): Promise<Sale[]> => {
  return request.get<Sale[]>(API_PATHS.sale.featured, { limit })
}

// 创建活动（管理员）
export const createSale = async (data: Sale): Promise<Sale> => {
  return request.post<Sale>(API_PATHS.sale.list, data)
}

// 更新活动（管理员）
export const updateSale = async (
  name: string,
  data: Partial<Sale>
): Promise<Sale> => {
  const url = API_PATHS.sale.detail.replace(':name', name)
  return request.put<Sale>(url, data)
}

// 删除活动（管理员）
export const deleteSale = async (name: string): Promise<void> => {
  const url = API_PATHS.sale.detail.replace(':name', name)
  return request.delete<void>(url)
}
