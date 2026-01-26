<template>
  <div class="container">
    <div class="page-header">
      <h1>🔥 限时活动</h1>
      <p>发现最新的优惠活动和特价商品</p>
    </div>
    
    <div class="sales-grid">
      <div 
        v-for="sale in sales" 
        :key="sale.slug" 
        class="sale-card"
      >
        <NuxtLink :to="`/sale/${sale.slug}`" class="sale-link">
          <div class="sale-badge">{{ sale.type }}</div>
          <div class="sale-image">
            <div class="placeholder-image">{{ sale.title.charAt(0) }}</div>
          </div>
          <div class="sale-info">
            <h3>{{ sale.title }}</h3>
            <div class="sale-dates">
              <span>📅 {{ sale.startDate }} - {{ sale.endDate }}</span>
            </div>
            <div class="sale-discount">
              <span class="discount-price">¥{{ sale.discountPrice }}</span>
              <span v-if="sale.originalPrice" class="original-price">¥{{ sale.originalPrice }}</span>
            </div>
            <div class="sale-status" :class="`sale-status--${sale.status}`">
              {{ sale.status === 'active' ? '进行中' : sale.status === 'upcoming' ? '即将开始' : '已结束' }}
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
    
    <div v-if="sales.length === 0" class="no-sales">
      <p>暂无活动，敬请期待！</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Sale {
  slug: string
  title: string
  type: string
  description: string
  startDate: string
  endDate: string
  discountPrice: number
  originalPrice?: number
  status: 'active' | 'upcoming' | 'ended'
  products: string[]
}

const sales: Sale[] = [
  {
    slug: 'new-year-sale',
    title: '新年特惠',
    type: '节日促销',
    description: '新年大促销，全场印刷产品8折优惠',
    startDate: '2024-01-01',
    endDate: '2024-01-15',
    discountPrice: 88,
    originalPrice: 110,
    status: 'active',
    products: ['商务名片', '宣传画册', '海报印刷']
  },
  {
    slug: 'spring-sale',
    title: '春季新品',
    type: '新品上市',
    description: '春季新品发布，定制包装设计75折',
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    discountPrice: 225,
    originalPrice: 300,
    status: 'active',
    products: ['包装设计', '手提袋定制']
  },
  {
    slug: 'anniversary-sale',
    title: '周年庆典',
    type: '限时折扣',
    description: '公司周年庆，书籍装订买二送一',
    startDate: '2024-03-10',
    endDate: '2024-03-20',
    discountPrice: 200,
    status: 'upcoming',
    products: ['书籍装订']
  },
  {
    slug: 'black-friday',
    title: '黑色星期五',
    type: '年度大促',
    description: '黑色星期五特惠，全场5折起',
    startDate: '2023-11-24',
    endDate: '2023-11-27',
    discountPrice: 50,
    originalPrice: 100,
    status: 'ended',
    products: ['全部产品']
  }
]

useHead({
  title: '限时活动 - RaceTopprint',
  meta: [
    { name: 'description', content: '浏览最新的优惠活动和特价商品' }
  ]
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  color: #e53e3e;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

.sales-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.sale-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
}

.sale-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.sale-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.sale-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #e53e3e;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  z-index: 10;
}

.sale-image {
  height: 200px;
  background: linear-gradient(135deg, #fef5e7, #fdebd0);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.sale-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.placeholder-image {
  font-size: 4rem;
  font-weight: bold;
  color: #e53e3e;
  z-index: 1;
}

.sale-info {
  padding: 1.5rem;
}

h3 {
  color: #333;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
  line-height: 1.3;
}

.sale-dates {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.sale-discount {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.discount-price {
  color: #e53e3e;
  font-weight: bold;
  font-size: 1.5rem;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 1rem;
}

.sale-status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
}

.sale-status--active {
  background: #f0fff4;
  color: #2f855a;
}

.sale-status--upcoming {
  background: #ebf8ff;
  color: #2c5282;
}

.sale-status--ended {
  background: #f7fafc;
  color: #718096;
}

.no-sales {
  text-align: center;
  padding: 4rem 0;
  color: #666;
}

@media (max-width: 768px) {
  .sales-grid {
    grid-template-columns: 1fr;
  }
}
</style>