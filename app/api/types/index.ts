// 基础响应类型
export interface BaseResponse<T = any> {
  code: number
  message: string
  data: T
}

// 分页响应类型
export interface PaginationResponse<T> {
  list: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// 产品类型
export interface Product {
  id: string | number
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  images: string[]
  features: string[]
  specifications: Record<string, any>
  stock: number
  sales: number
  rating: number
  reviewCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// 产品列表响应
export interface ProductListResponse extends PaginationResponse<Product> {}

// 产品详情响应
export interface ProductDetailResponse {
  product: Product
  relatedProducts: Product[]
  reviews: Review[]
}

// 活动类型
export interface Sale {
  id: string | number
  slug: string
  title: string
  description: string
  type: string
  startDate: string
  endDate: string
  discountPrice: number
  originalPrice?: number
  discount: number
  status: 'active' | 'upcoming' | 'ended'
  products: (string | number)[]
  image: string
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

// 活动列表响应
export interface SaleListResponse extends PaginationResponse<Sale> {}

// 活动详情响应
export interface SaleDetailResponse {
  sale: Sale
  saleProducts: Product[]
  relatedSales: Sale[]
}

// 用户类型
export interface User {
  id: string | number
  username: string
  email: string
  avatar?: string
  nickname?: string
  phone?: string
  address?: string
  role: 'user' | 'admin' | 'editor'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// 用户信息响应
export interface UserProfile extends User {
  ordersCount: number
  favoritesCount: number
  cartCount: number
}

// 登录响应
export interface LoginResponse {
  token: string
  refreshToken: string
  user: UserProfile
}

// 注册响应
export interface RegisterResponse {
  message: string
  userId: string | number
}

// 订单类型
export interface Order {
  id: string | number
  orderNo: string
  userId: string | number
  items: OrderItem[]
  totalAmount: number
  discountAmount: number
  finalAmount: number
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentMethod: string
  paymentNo?: string
  shippingAddress: Address
  shippingMethod: string
  trackingNo?: string
  remark?: string
  createdAt: string
  updatedAt: string
  paidAt?: string
  shippedAt?: string
  deliveredAt?: string
}

// 订单项类型
export interface OrderItem {
  id: string | number
  orderId: string | number
  productId: string | number
  productName: string
  productImage: string
  price: number
  quantity: number
  total: number
  options?: Record<string, any>
}

// 地址类型
export interface Address {
  id?: string | number
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  zipCode?: string
  isDefault?: boolean
}

// 订单列表响应
export interface OrderListResponse extends PaginationResponse<Order> {}

// 订单详情响应
export interface OrderDetailResponse {
  order: Order
  trackingInfo?: TrackingInfo
}

// 物流信息类型
export interface TrackingInfo {
  trackingNo: string
  carrier: string
  status: string
  history: TrackingHistory[]
}

// 物流历史类型
export interface TrackingHistory {
  time: string
  location: string
  status: string
  description: string
}

// 创建订单请求
export interface CreateOrderRequest {
  items: Array<{
    productId: string | number
    quantity: number
    options?: Record<string, any>
  }>
  shippingAddress: Address
  shippingMethod: string
  paymentMethod: string
  remark?: string
  couponCode?: string
}

// 购物车项类型
export interface CartItem {
  id: string | number
  userId: string | number
  productId: string | number
  product: Product
  quantity: number
  options?: Record<string, any>
  createdAt: string
  updatedAt: string
}

// 购物车列表响应
export interface CartListResponse {
  items: CartItem[]
  totalItems: number
  totalAmount: number
}

// 评价类型
export interface Review {
  id: string | number
  orderId: string | number
  productId: string | number
  userId: string | number
  user: {
    id: string | number
    username: string
    avatar?: string
  }
  rating: number
  comment: string
  images: string[]
  isAnonymous: boolean
  createdAt: string
  updatedAt: string
}

// 文件上传响应
export interface UploadResponse {
  url: string
  filename: string
  size: number
  type: string
}

// 优惠券类型
export interface Coupon {
  id: string | number
  code: string
  name: string
  type: 'fixed' | 'percent'
  value: number
  minAmount?: number
  maxDiscount?: number
  startDate: string
  endDate: string
  usageLimit: number
  usedCount: number
  isActive: boolean
}
