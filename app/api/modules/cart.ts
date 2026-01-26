import { request } from '~/utils/request'
import { API_PATHS } from '../config'
import type { CartItem, CartListResponse } from '../types'

// 获取购物车列表
export const getCartList = async (): Promise<CartListResponse> => {
  return request.get<CartListResponse>(API_PATHS.cart.list)
}

// 添加商品到购物车
export const addToCart = async (data: {
  productId: string | number
  quantity: number
  options?: Record<string, any>
}): Promise<CartItem> => {
  return request.post<CartItem>(API_PATHS.cart.add, data)
}

// 更新购物车商品
export const updateCartItem = async (
  id: string | number,
  data: {
    quantity: number
    options?: Record<string, any>
  }
): Promise<CartItem> => {
  const url = API_PATHS.cart.update.replace(':id', id.toString())
  return request.put<CartItem>(url, data)
}

// 删除购物车商品
export const removeFromCart = async (id: string | number): Promise<void> => {
  const url = API_PATHS.cart.remove.replace(':id', id.toString())
  return request.delete<void>(url)
}

// 清空购物车
export const clearCart = async (): Promise<void> => {
  return request.post<void>(API_PATHS.cart.clear)
}

// 批量更新购物车
export const batchUpdateCart = async (
  items: Array<{
    id: string | number
    quantity: number
  }>
): Promise<CartItem[]> => {
  return request.put<CartItem[]>(API_PATHS.cart.list, { items })
}
