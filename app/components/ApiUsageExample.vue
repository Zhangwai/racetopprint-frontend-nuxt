<template>
  <div class="api-usage-example">
    <h2>📦 API 使用示例</h2>
    
    <!-- 示例 1: 在 setup 中直接调用 -->
    <div class="example-section">
      <h3>示例 1: 在 setup 中直接调用</h3>
      <div v-if="loading1" class="loading">加载中...</div>
      <div v-else-if="error1" class="error">❌ {{ error1 }}</div>
      <div v-else class="result">
        <p>产品数量: {{ products1?.length || 0 }}</p>
        <ul>
          <li v-for="product in products1?.slice(0, 3)" :key="product.id">
            {{ product.name }} - ¥{{ product.price }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 示例 2: 使用 useFetch -->
    <div class="example-section">
      <h3>示例 2: 使用 useFetch</h3>
      <div v-if="loading2" class="loading">加载中...</div>
      <div v-else-if="error2" class="error">❌ {{ error2 }}</div>
      <div v-else class="result">
        <p>活动数量: {{ sales?.length || 0 }}</p>
        <ul>
          <li v-for="sale in sales?.slice(0, 3)" :key="sale.id">
            {{ sale.title }} - {{ sale.status }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 示例 3: 使用 useAsyncData -->
    <div class="example-section">
      <h3>示例 3: 使用 useAsyncData</h3>
      <div v-if="loading3" class="loading">加载中...</div>
      <div v-else-if="error3" class="error">❌ {{ error3 }}</div>
      <div v-else class="result">
        <p>产品数量: {{ products3?.length || 0 }}</p>
        <ul>
          <li v-for="product in products3?.slice(0, 3)" :key="product.id">
            {{ product.name }} - ¥{{ product.price }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 示例 1: 在 setup 中直接调用（客户端）
const products1 = ref<any[]>([])
const loading1 = ref(false)
const error1 = ref('')

onMounted(async () => {
  loading1.value = true
  try {
    const response = await $fetch('/api/products', {
      params: { page: 1, pageSize: 5 }
    })
    if (response.code === 200) {
      products1.value = response.data.list
    }
  } catch (err: any) {
    error1.value = err.message || '请求失败'
  } finally {
    loading1.value = false
  }
})

// 示例 2: 使用 useFetch（SSR）
const { data: sales, pending: loading2, error: error2 } = await useFetch('/api/sales', {
  params: { page: 1, pageSize: 10 },
  transform: (response) => {
    if (response.code === 200) {
      return response.data.list
    }
    return []
  }
})

// 示例 3: 使用 useAsyncData（SSR）
const { data: products3, pending: loading3, error: error3 } = await useAsyncData(
  'products-example',
  async () => {
    const response = await $fetch('/api/products', {
      params: { page: 1, pageSize: 3 }
    })
    if (response.code === 200) {
      return response.data.list
    }
    return []
  }
)
</script>

<style scoped>
.api-usage-example {
  padding: 20px;
  background: white;
  border-radius: 12px;
  margin: 20px 0;
}

.api-usage-example h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
}

.example-section {
  margin-bottom: 25px;
  padding: 15px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #4f46e5;
}

.example-section h3 {
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 10px;
}

.loading {
  color: #666;
  padding: 10px;
}

.error {
  color: #dc2626;
  padding: 10px;
}

.result {
  color: #333;
}

.result p {
  margin-bottom: 10px;
  font-weight: 500;
}

.result ul {
  list-style: none;
  padding: 0;
}

.result li {
  padding: 5px 0;
  border-bottom: 1px solid #e5e7eb;
}

.result li:last-child {
  border-bottom: none;
}
</style>
