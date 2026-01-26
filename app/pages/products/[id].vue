<template>
  <div class="container">
    <NuxtLink to="/products" class="back-link">← 返回产品列表</NuxtLink>
    
    <div v-if="product" class="product-detail">
      <div class="product-image">
        <div class="placeholder-image">{{ product.name.charAt(0) }}</div>
      </div>
      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <p class="price">¥{{ product.price }}</p>
        <p class="description">{{ product.description }}</p>
        <div class="features">
          <h3>产品特点</h3>
          <ul>
            <li>高品质材料</li>
            <li>专业设计团队</li>
            <li>快速交付</li>
            <li>质量保证</li>
          </ul>
        </div>
        <button class="buy-btn">立即购买</button>
      </div>
    </div>
    
    <div v-else class="not-found">
      <h2>产品未找到</h2>
      <p>抱歉，该产品不存在或已下架</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const productId = Number(route.params.id)

interface Product {
  id: number
  name: string
  price: number
  description: string
}

const products: Product[] = [
  {
    id: 1,
    name: '商务名片',
    price: 50,
    description: '高品质商务名片，多种材质可选，包括铜版纸、哑粉纸、特种纸等'
  },
  {
    id: 2,
    name: '宣传画册',
    price: 150,
    description: '精美宣传画册，专业设计印刷，支持多种装订方式'
  },
  {
    id: 3,
    name: '海报印刷',
    price: 80,
    description: '高清海报印刷，多种尺寸可选，防水防晒材质'
  },
  {
    id: 4,
    name: '书籍装订',
    price: 200,
    description: '专业书籍装订，精装平装可选，提供ISBN申请服务'
  },
  {
    id: 5,
    name: '包装设计',
    price: 300,
    description: '创意包装设计，提升产品价值，一站式解决方案'
  },
  {
    id: 6,
    name: '手提袋定制',
    price: 120,
    description: '环保手提袋，企业形象宣传，可定制尺寸和材质'
  }
]

const product = products.find(p => p.id === productId)

useHead({
  title: product ? `${product.name} - RaceTopprint` : '产品详情 - RaceTopprint',
  meta: [
    { 
      name: 'description', 
      content: product ? product.description : '产品详情页面' 
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

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.product-image {
  height: 400px;
  background: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-image {
  font-size: 6rem;
  font-weight: bold;
  color: #4299e1;
}

.product-info h1 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.price {
  color: #48bb78;
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

features h3 {
  color: #333;
  margin-bottom: 1rem;
}

features ul {
  list-style: none;
  padding: 0;
}

features li {
  padding: 0.5rem 0;
  color: #666;
  position: relative;
  padding-left: 1.5rem;
}

features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #48bb78;
  font-weight: bold;
}

.buy-btn {
  width: 100%;
  padding: 1rem;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 2rem;
}

.buy-btn:hover {
  background: #38a169;
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
}

@media (max-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr;
  }
}
</style>