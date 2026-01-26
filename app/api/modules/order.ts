import { request } from '~/utils/request'
import { API_PATHS } from '../config'
import type { Order, OrderListResponse, OrderDetailResponse, CreateOrderRequest } from '../types'

// 获取订单列表
export const getOrderList = async (params?: {
  page?: number
  pageSize?: number
  status?: string
  startDate?: string
  endDate?: string
}): Promise<OrderListResponse> => {
  return request.get<OrderListResponse>(API_PATHS.order.list, params)
}

// 获取订单详情
export const getOrderDetail = async (id: string | number): Promise<OrderDetailResponse> => {
  const url = API_PATHS.order.detail.replace(':id', id.toString())
  return request.get<OrderDetailResponse>(url)
}

// 创建订单
export const createOrder = async (data: CreateOrderRequest): Promise<Order> => {
  return request.post<Order>(API_PATHS.order.create, data)
}

// 更新订单
export const updateOrder = async (
  id: string | number,
  data: Partial<Order>
): Promise<Order> => {
  const url = API_PATHS.order.update.replace(':id', id.toString())
  return request.put<Order>(url, data)
}

// 取消订单
export const cancelOrder = async (id: string | number): Promise<void> => {
  const url = API_PATHS.order.cancel.replace(':id', id.toString())
  return request.post<void>(url)
}

// 确认收货
export const confirmOrder = async (id: string | number): Promise<void> => {
  const url = API_PATHS.order.detail.replace(':id', id.toString()) + '/confirm'
  return request.post<void>(url)
}

// 评价订单
export const reviewOrder = async (
  id: string | number,
  data: {
    rating: number
    comment: string
    images?: string[]
  }
): Promise<void> => {
  const url = API_PATHS.order.detail.replace(':id', id.toString()) + '/review'
  return request.post<void>(url, data)
}
