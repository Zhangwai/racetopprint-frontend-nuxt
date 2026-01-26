<template>
  <div class="api-test-container">
    <div class="page-header">
      <h1>🔧 API 请求测试</h1>
      <p>测试基础请求库和 API 模块功能</p>
    </div>

    <div class="test-sections">
      <!-- 基础请求测试 -->
      <section class="test-section">
        <h2>基础请求测试</h2>
        <div class="test-buttons">
          <button @click="testGetRequest" :disabled="loading" class="btn btn-primary">
            {{ loading ? '加载中...' : '测试 GET 请求' }}
          </button>
          <button @click="testPostRequest" :disabled="loading" class="btn btn-secondary">
            {{ loading ? '加载中...' : '测试 POST 请求' }}
          </button>
        </div>
      </section>

      <!-- Mock 数据展示 -->
      <section class="test-section">
        <h2>Mock 数据展示</h2>
        <div class="mock-data">
          <h3>产品列表</h3>
          <div class="product-grid">
            <div v-for="product in mockProducts" :key="product.id" class="product-card">
              <div class="product-image">
                <div class="placeholder">{{ product.name.charAt(0) }}</div>
              </div>
              <div class="product-info">
                <h4>{{ product.name }}</h4>
                <p class="price">¥{{ product.price }}</p>
                <p class="category">{{ product.category }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- API 模块测试 -->
      <section class="test-section">
        <h2>API 模块使用示例</h2>
        <div class="code-example">
          <pre><code>// 导入 API 模块import { productApi, saleApi } from '~/api'

// 使用示例const products = await productApi.getProductList({
  page: 1,
  pageSize: 10,
  category: 'business'})

const sale = await saleApi.getSaleDetail('new-year-sale')</code></pre>
        </div>
      </section>

      <!-- 类型定义展示 -->
      <section class="test-section">
        <h2>TypeScript 类型支持</h2>
        <div class="type-info">
          <p>✅ 完整的 TypeScript 类型定义</p>
          <p>✅ 自动补全和类型检查</p>
          <p>✅ 统一的响应格式</p>
          <p>✅ 分页和错误处理</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { request } from '~/utils/request'
import type { Product } from '~/api/types'

const loading = ref(false)

// Mock 产品数据
const mockProducts = ref<Product[]>([
  {
    id: 1,
    name: '商务名片',
    description: '高品质商务名片印刷',
    price: 88,
    category: '商务印刷',
    images: [],
    features: ['双面印刷', '铜版纸', '圆角处理'],
    specifications: {},
    stock: 100,
    sales: 500,
    rating: 4.8,
    reviewCount: 234,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: 2,
    name: '宣传画册',
    description: '企业宣传画册设计印刷',
    price: 299,
    category: '商务印刷',
    images: [],
    features: ['全彩印刷', '铜版纸', '锁线装订'],
    specifications: {},
    stock: 50,
    sales: 234,
    rating: 4.9,
    reviewCount: 156,
    isActive: true,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-20'
  },
  {
    id: 3,
    name: '海报印刷',
    description: '高清海报印刷服务',
    price: 58,
    category: '广告印刷',
    images: [],
    features: ['大尺寸', '防水', '哑膜'],
    specifications: {},
    stock: 200,
    sales: 890,
    rating: 4.7,
    reviewCount: 345,
    isActive: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-25'
  }
])

// 测试 GET 请求
const testGetRequest = async () => {
  loading.value = true
  try {
    // 使用 JSONPlaceholder 进行测试
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1', {}, {
      baseURL: ''
    })
    console.log('GET 请求成功:', response)
    alert('GET 请求成功！查看控制台获取详细信息')
  } catch (error) {
    console.error('GET 请求失败:', error)
    alert('GET 请求失败！查看控制台获取详细信息')
  } finally {
    loading.value = false
  }
}

// 测试 POST 请求
const testPostRequest = async () => {
  loading.value = true
  try {
    // 使用 JSONPlaceholder 进行测试
    const response = await request.post(
      'https://jsonplaceholder.typicode.com/posts',
      {
        title: 'foo',
        body: 'bar',
        userId: 1
      },
      {
        baseURL: ''
      }
    )
    console.log('POST 请求成功:', response)
    alert('POST 请求成功！查看控制台获取详细信息')
  } catch (error) {
    console.error('POST 请求失败:', error)
    alert('POST 请求失败！查看控制台获取详细信息')
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'API 请求测试 - RaceTopprint'
})
</script>

<style scoped>
.api-test-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.page-header p {
  font-size: 1.1rem;
  color: #666;
}

.test-sections {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.test-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.test-section h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.test-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #4338ca;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
  transform: translateY(-2px);
}

.mock-data {
  margin-top: 20px;
}

.mock-data h3 {
  font-size: 1.2rem;
  color: #444;
  margin-bottom: 15px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.product-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.product-image {
  height: 180px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  opacity: 0.9;
}

.product-info {
  padding: 20px;
}

.product-info h4 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 10px;
}

.price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #4f46e5;
  margin-bottom: 5px;
}

.category {
  font-size: 0.9rem;
  color: #666;
}

.code-example {
  background: #1e293b;
  border-radius: 12px;
  padding: 25px;
  overflow-x: auto;
}

.code-example pre {
  margin: 0;
}

.code-example code {
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  font-size: 0.9rem;
  color: #e2e8f0;
  line-height: 1.8;
}

.type-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.type-info p {
  font-size: 1rem;
  color: #444;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #4f46e5;
}

@media (max-width: 768px) {
  .api-test-container {
    padding: 20px 15px;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }

  .test-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
