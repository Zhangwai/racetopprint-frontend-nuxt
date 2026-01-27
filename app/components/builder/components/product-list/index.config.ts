import type { ComponentDefinition } from '~/types/component-builder'

const productListConfig: ComponentDefinition = {
  type: 'product-list',
  name: '商品列表',
  icon: '📦',
  description: '商品展示列表，支持网格布局和列表布局',
  category: 'product',
  defaultProps: {
    products: [
      {
        id: '1',
        name: '夏季新款连衣裙',
        description: '时尚优雅，舒适透气',
        image: 'https://picsum.photos/300/300?random=1',
        price: 199,
        originalPrice: 299,
        discount: 33,
        sales: 500,
        rating: 4.8
      },
      {
        id: '2',
        name: '男士休闲T恤',
        description: '纯棉面料，柔软舒适',
        image: 'https://picsum.photos/300/300?random=2',
        price: 99,
        originalPrice: 159,
        discount: 38,
        sales: 800,
        rating: 4.6
      },
      {
        id: '3',
        name: '运动鞋男款',
        description: '轻便透气，缓震舒适',
        image: 'https://picsum.photos/300/300?random=3',
        price: 399,
        originalPrice: 599,
        discount: 33,
        sales: 1200,
        rating: 4.9
      },
      {
        id: '4',
        name: '女士牛仔裤',
        description: '修身显瘦，弹力舒适',
        image: 'https://picsum.photos/300/300?random=4',
        price: 159,
        originalPrice: 259,
        discount: 39,
        sales: 650,
        rating: 4.7
      },
      {
        id: '5',
        name: '时尚双肩包',
        description: '大容量，防水面料',
        image: 'https://picsum.photos/300/300?random=5',
        price: 259,
        originalPrice: 399,
        discount: 35,
        sales: 400,
        rating: 4.5
      },
      {
        id: '6',
        name: '智能手表',
        description: '运动监测，心率检测',
        image: 'https://picsum.photos/300/300?random=6',
        price: 599,
        originalPrice: 899,
        discount: 33,
        sales: 900,
        rating: 4.8
      },
      {
        id: '7',
        name: '防晒衣女款',
        description: '轻薄透气，UPF50+',
        image: 'https://picsum.photos/300/300?random=7',
        price: 129,
        originalPrice: 199,
        discount: 35,
        sales: 750,
        rating: 4.6
      },
      {
        id: '8',
        name: '蓝牙耳机',
        description: '降噪功能，长续航',
        image: 'https://picsum.photos/300/300?random=8',
        price: 329,
        originalPrice: 499,
        discount: 34,
        sales: 1500,
        rating: 4.9
      }
    ],
    title: '热门商品',
    description: '精选热销商品，限时优惠',
    layout: 'grid',
    columns: 4,
    limit: 8,
    showPrice: true,
    showDiscount: true,
    showAddToCart: true,
    addToCartText: '加入购物车',
    showLoadMore: false,
    loadMoreText: '加载更多',
    loading: false
  },
  propertySchema: {
    title: {
      label: '列表标题',
      type: 'string',
      placeholder: '输入列表标题',
      default: '热门商品'
    },
    description: {
      label: '列表描述',
      type: 'textarea',
      placeholder: '输入列表描述',
      rows: 2
    },
    layout: {
      label: '布局方式',
      type: 'select',
      options: [
        { value: 'grid', label: '网格布局' },
        { value: 'list', label: '列表布局' },
        { value: 'waterfall', label: '瀑布流布局' }
      ],
      default: 'grid'
    },
    columns: {
      label: '列数',
      type: 'number',
      min: 1,
      max: 6,
      default: 4
    },
    limit: {
      label: '显示数量',
      type: 'number',
      min: 1,
      max: 100,
      default: 8
    },
    showPrice: {
      label: '显示价格',
      type: 'boolean',
      default: true
    },
    showDiscount: {
      label: '显示折扣',
      type: 'boolean',
      default: true
    },
    showAddToCart: {
      label: '显示加入购物车按钮',
      type: 'boolean',
      default: true
    },
    addToCartText: {
      label: '按钮文字',
      type: 'string',
      placeholder: '输入按钮文字',
      default: '加入购物车'
    },
    showLoadMore: {
      label: '显示加载更多',
      type: 'boolean',
      default: false
    },
    loadMoreText: {
      label: '加载更多文字',
      type: 'string',
      placeholder: '输入加载更多文字',
      default: '加载更多'
    }
  },
  preview: 'https://picsum.photos/300/300',
  tags: ['商品', '列表', '网格', '产品展示']
}
export  default productListConfig