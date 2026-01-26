<template>
  <div class="container">
    <NuxtLink to="/sale" class="back-link">← 返回活动列表</NuxtLink>
    
    <div v-if="sale" class="sale-detail">
      <div class="sale-header">
        <div class="sale-badge">{{ sale.type }}</div>
        <div class="sale-status" :class="`sale-status--${sale.status}`">
          {{ sale.status === 'active' ? '🔥 进行中' : sale.status === 'upcoming' ? '⏰ 即将开始' : '✅ 已结束' }}
        </div>
      </div>
      
      <div class="sale-main">
        <div class="sale-image">
          <div class="placeholder-image">{{ sale.title.charAt(0) }}</div>
        </div>
        <div class="sale-info">
          <h1>{{ sale.title }}</h1>
          <p class="sale-description">{{ sale.description }}</p>
          
          <div class="sale-timeline">
            <div class="timeline-item">
              <span class="timeline-label">开始时间</span>
              <span class="timeline-value">{{ sale.startDate }}</span>
            </div>
            <div class="timeline-divider">→</div>
            <div class="timeline-item">
              <span class="timeline-label">结束时间</span>
              <span class="timeline-value">{{ sale.endDate }}</span>
            </div>
          </div>
          
          <div class="pricing-section">
            <div class="price-info">
              <span class="discount-price">¥{{ sale.discountPrice }}</span>
              <span v-if="sale.originalPrice" class="original-price">原价: ¥{{ sale.originalPrice }}</span>
              <span v-if="sale.originalPrice" class="discount-percentage">
                省 ¥{{ sale.originalPrice - sale.discountPrice }} ({{ Math.round((1 - sale.discountPrice / sale.originalPrice) * 100) }}%)
              </span>
            </div>
            
            <div class="countdown" v-if="sale.status === 'active'">
              <div class="countdown-label">距离活动结束还有</div>
              <div class="countdown-timer">
                <div class="countdown-item">
                  <span class="countdown-value">{{ countdown.days }}</span>
                  <span class="countdown-unit">天</span>
                </div>
                <span class="countdown-separator">:</span>
                <div class="countdown-item">
                  <span class="countdown-value">{{ countdown.hours }}</span>
                  <span class="countdown-unit">时</span>
                </div>
                <span class="countdown-separator">:</span>
                <div class="countdown-item">
                  <span class="countdown-value">{{ countdown.minutes }}</span>
                  <span class="countdown-unit">分</span>
                </div>
                <span class="countdown-separator">:</span>
                <div class="countdown-item">
                  <span class="countdown-value">{{ countdown.seconds }}</span>
                  <span class="countdown-unit">秒</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="sale-products">
            <h3>活动包含产品</h3>
            <div class="product-tags">
              <span v-for="product in sale.products" :key="product" class="product-tag">
                {{ product }}
              </span>
            </div>
          </div>
          
          <div class="action-buttons">
            <AppButton 
              v-if="sale.status === 'active'" 
              text="立即购买"
              variant="success"
              @click="handlePurchase"
            />
            <AppButton 
              v-else-if="sale.status === 'upcoming'" 
              text="提醒我"
              variant="secondary"
              @click="handleRemind"
            />
            <AppButton 
              v-else 
              text="查看其他活动"
              variant="primary"
              @click="goToSales"
            />
          </div>
        </div>
      </div>
      
      <div class="sale-terms">
        <h3>活动条款</h3>
        <ul>
          <li>活动仅限新用户参与</li>
          <li>每个用户限购买一次</li>
          <li>活动优惠不可与其他优惠叠加使用</li>
          <li>活动最终解释权归 RaceTopprint 所有</li>
        </ul>
      </div>
    </div>
    
    <div v-else class="not-found">
      <h2>活动未找到</h2>
      <p>抱歉，该活动不存在或已下线</p>
      <AppButton text="返回活动列表" variant="primary" @click="goToSales" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const route = useRoute()
const saleName = route.params.name as string

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
    description: '新年大促销，全场印刷产品8折优惠。活动期间，所有商务名片、宣传画册、海报印刷等产品均可享受8折优惠。',
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
    description: '春季新品发布，定制包装设计75折。全新包装设计服务，帮助您的产品脱颖而出。',
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
    description: '公司周年庆，书籍装订买二送一。专业书籍装订服务，精装平装可选。',
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
    description: '黑色星期五特惠，全场5折起。年度最大力度促销活动，千万不要错过！',
    startDate: '2023-11-24',
    endDate: '2023-11-27',
    discountPrice: 50,
    originalPrice: 100,
    status: 'ended',
    products: ['全部产品']
  }
]

const sale = computed(() => sales.find(s => s.slug === saleName))

const countdown = ref({
  days: '00',
  hours: '00',
  minutes: '00',
  seconds: '00'
})

let timer: number | null = null

const updateCountdown = () => {
  if (!sale.value) return
  
  const endDate = new Date(sale.value.endDate)
  const now = new Date()
  const diff = endDate.getTime() - now.getTime()
  
  if (diff <= 0) {
    countdown.value = { days: '00', hours: '00', minutes: '00', seconds: '00' }
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    return
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  countdown.value = {
    days: days.toString().padStart(2, '0'),
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0')
  }
}

onMounted(() => {
  if (sale.value?.status === 'active') {
    updateCountdown()
    timer = window.setInterval(updateCountdown, 1000)
  }
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

const handlePurchase = () => {
  alert('即将跳转到购买页面...')
}

const handleRemind = () => {
  alert('已设置提醒，活动开始前我们会通知您！')
}

const goToSales = () => {
  navigateTo('/sale')
}

useHead({
  title: sale.value ? `${sale.value.title} - RaceTopprint` : '活动详情 - RaceTopprint',
  meta: [
    { 
      name: 'description', 
      content: sale.value ? sale.value.description : '活动详情页面' 
    }
  ]
})
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.back-link {
  display: inline-block;
  margin-bottom: 2rem;
  color: #4299e1;
  text-decoration: none;
  font-weight: 500;
}

.back-link:hover {
  text-decoration: underline;
}

.sale-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.sale-badge {
  background: #e53e3e;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: bold;
}

.sale-status {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
}

.sale-status--active {
  background: #fef2f2;
  color: #dc2626;
  border: 2px solid #fca5a5;
}

.sale-status--upcoming {
  background: #eff6ff;
  color: #2563eb;
  border: 2px solid #93c5fd;
}

.sale-status--ended {
  background: #f3f4f6;
  color: #6b7280;
  border: 2px solid #d1d5db;
}

.sale-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.sale-image {
  height: 400px;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-image {
  font-size: 6rem;
  font-weight: bold;
  color: #e53e3e;
}

.sale-info h1 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.sale-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.sale-timeline {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.timeline-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.timeline-label {
  font-size: 0.85rem;
  color: #9ca3af;
}

.timeline-value {
  font-weight: bold;
  color: #333;
}

.timeline-divider {
  color: #d1d5db;
  font-weight: bold;
}

.pricing-section {
  margin-bottom: 2rem;
}

.price-info {
  padding: 1.5rem;
  background: #fef2f2;
  border-radius: 8px;
  border-left: 4px solid #e53e3e;
  margin-bottom: 1.5rem;
}

.discount-price {
  display: block;
  color: #dc2626;
  font-weight: bold;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.original-price {
  color: #9ca3af;
  text-decoration: line-through;
  margin-right: 1rem;
}

.discount-percentage {
  color: #ef4444;
  font-weight: 500;
}

.countdown {
  padding: 1.5rem;
  background: #fef2f2;
  border-radius: 8px;
  text-align: center;
}

.countdown-label {
  display: block;
  color: #ef4444;
  font-weight: bold;
  margin-bottom: 1rem;
}

.countdown-timer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.countdown-item {
  display: flex;
  flex-direction: column;
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  min-width: 60px;
}

.countdown-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ef4444;
  font-variant-numeric: tabular-nums;
}

.countdown-unit {
  font-size: 0.85rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}

.countdown-separator {
  color: #ef4444;
  font-weight: bold;
  font-size: 1.25rem;
}

.sale-products {
  margin-bottom: 2rem;
}

.sale-products h3 {
  color: #333;
  margin-bottom: 1rem;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.product-tag {
  background: #e5e7eb;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.action-buttons button {
  flex: 1;
  min-width: 150px;
}

.sale-terms {
  background: #f9fafb;
  padding: 2rem;
  border-radius: 8px;
}

.sale-terms h3 {
  color: #333;
  margin-bottom: 1rem;
}

.sale-terms ul {
  list-style: none;
  padding: 0;
}

.sale-terms li {
  padding: 0.5rem 0;
  color: #666;
  position: relative;
  padding-left: 1.5rem;
}

.sale-terms li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #e53e3e;
  font-weight: bold;
}

.not-found {
  text-align: center;
  padding: 4rem 0;
}

.not-found h2 {
  color: #333;
  margin-bottom: 1rem;
}

.not-found p {
  color: #666;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .sale-main {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .countdown-timer {
    gap: 0.25rem;
  }
  
  .countdown-item {
    min-width: 50px;
    padding: 0.5rem 0.75rem;
  }
}
</style>