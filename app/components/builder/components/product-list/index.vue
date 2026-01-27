<template>
  <div class="product-list" :style="containerStyle">
    <div class="list-header">
      <h2 v-if="title">{{ title }}</h2>
      <p v-if="description">{{ description }}</p>
    </div>
    
    <div 
      class="products-grid"
      :class="`layout-${layout}`"
      :style="gridStyle"
    >
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
        @click="$emit('product-click', product)"
      >
        <div class="product-image">
          <img :src="product.image" :alt="product.name" />
          <div v-if="product.discount" class="discount-badge">
            -{{ product.discount }}%
          </div>
        </div>
        
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p v-if="product.description" class="product-description">{{ product.description }}</p>
          
          <div class="product-price">
            <span v-if="product.originalPrice" class="original-price">
              ¥{{ product.originalPrice }}
            </span>
            <span class="current-price">¥{{ product.price }}</span>
          </div>
          
          <div class="product-meta">
            <span v-if="product.sales" class="sales-count">
              已售 {{ product.sales }}
            </span>
            <span v-if="product.rating" class="rating">
              ⭐ {{ product.rating }}
            </span>
          </div>
          
          <button 
            v-if="showAddToCart"
            class="add-to-cart-btn"
            @click.stop="$emit('add-to-cart', product)"
          >
            {{ addToCartText }}
          </button>
        </div>
      </div>
    </div>
    
    <button 
      v-if="showLoadMore && products.length >= limit"
      class="load-more-btn"
      @click="$emit('load-more')"
      :disabled="loading"
    >
      {{ loading ? '加载中...' : loadMoreText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  products: Array<{
    id: string
    name: string
    description?: string
    image: string
    price: number
    originalPrice?: number
    discount?: number
    sales?: number
    rating?: number
  }>
  title?: string
  description?: string
  layout?: 'grid' | 'list' | 'waterfall'
  columns?: number
  limit?: number
  showPrice?: boolean
  showDiscount?: boolean
  showAddToCart?: boolean
  addToCartText?: string
  showLoadMore?: boolean
  loadMoreText?: string
  loading?: boolean
}>(), {
  layout: 'grid',
  columns: 4,
  limit: 10,
  showPrice: true,
  showDiscount: true,
  showAddToCart: true,
  addToCartText: '加入购物车',
  showLoadMore: false,
  loadMoreText: '加载更多'
})

defineEmits<{
  (e: 'product-click', product: any): void
  (e: 'add-to-cart', product: any): void
  (e: 'load-more'): void
}>()

const containerStyle = computed(() => ({}))

const gridStyle = computed(() => {
  if (props.layout === 'list') {
    return { gridTemplateColumns: '1fr' }
  }
  return {
    gridTemplateColumns: `repeat(${props.columns || 4}, 1fr)`
  }
})
</script>

<style scoped>
.product-list {
  padding: 20px;
}

.list-header {
  margin-bottom: 20px;
  text-align: center;
}

.list-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #1f2937;
}

.list-header p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.products-grid {
  display: grid;
  gap: 20px;
  margin-bottom: 20px;
}

.layout-grid {
  grid-template-columns: repeat(4, 1fr);
}

.layout-list {
  grid-template-columns: 1fr;
}

.product-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.product-image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.discount-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ef4444;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.product-info {
  padding: 16px;
}

.product-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-description {
  margin: 0 0 12px 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  margin-bottom: 8px;
}

.original-price {
  text-decoration: line-through;
  color: #9ca3af;
  font-size: 14px;
  margin-right: 8px;
}

.current-price {
  color: #ef4444;
  font-size: 18px;
  font-weight: 600;
}

.product-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #9ca3af;
}

.add-to-cart-btn {
  width: 100%;
  padding: 10px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-to-cart-btn:hover {
  background-color: #4338ca;
}

.load-more-btn {
  width: 100%;
  padding: 12px;
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.load-more-btn:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.load-more-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>