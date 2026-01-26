<template>
  <div class="container">
    <h1>产品列表</h1>
    <div class="products-grid">
      <div 
        v-for="product in products" 
        :key="product.id" 
        class="product-card"
      >
        <NuxtLink :to="`/products/${product.id}`" class="product-link">
          <div class="product-image">
            <div class="placeholder-image">{{ product.name.charAt(0) }}</div>
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="price">¥{{ product.price }}</p>
            <p class="description">{{ product.description }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
    description: '高品质商务名片，多种材质可选'
  },
  {
    id: 2,
    name: '宣传画册',
    price: 150,
    description: '精美宣传画册，专业设计印刷'
  },
  {
    id: 3,
    name: '海报印刷',
    price: 80,
    description: '高清海报印刷，多种尺寸可选'
  },
  {
    id: 4,
    name: '书籍装订',
    price: 200,
    description: '专业书籍装订，精装平装可选'
  },
  {
    id: 5,
    name: '包装设计',
    price: 300,
    description: '创意包装设计，提升产品价值'
  },
  {
    id: 6,
    name: '手提袋定制',
    price: 120,
    description: '环保手提袋，企业形象宣传'
  }
]

useHead({
  title: '产品列表 - RaceTopprint',
  meta: [
    { name: 'description', content: '浏览我们的印刷产品和服务' }
  ]
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.product-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.product-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.product-image {
  height: 200px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-image {
  font-size: 4rem;
  font-weight: bold;
  color: #4299e1;
}

.product-info {
  padding: 1.5rem;
}

h3 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.price {
  color: #48bb78;
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.description {
  color: #666;
  line-height: 1.5;
  font-size: 0.9rem;
}
</style>