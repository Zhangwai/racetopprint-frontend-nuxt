<template>
  <div class="ssr-demo-container">
    <div class="page-header">
      <h1>⚡ SSR 演示页面</h1>
      <p>服务器端渲染数据预取示例</p>
    </div>

    <!-- 产品列表（CSR 客户端渲染） -->
    <section class="demo-section">
      <h2>📦 产品列表（CSR 客户端渲染）</h2>
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>
      <div v-else-if="error" class="error">
        <p>❌ {{ error }}</p>
      </div>
      <div v-else class="product-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <div class="product-image">
            <div class="placeholder">{{ product.name.charAt(0) }}</div>
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="price">¥{{ product.price }}</p>
            <p class="category">{{ product.category }}</p>
            <p class="rating">
              ⭐ {{ product.rating }} ({{ product.reviewCount }} 评价)
            </p>
          </div>
        </div>
      </div>
      <div class="csr-hint">
        <p>💡 这是客户端渲染（CSR），数据在浏览器中获取</p>
      </div>
    </section>

    <!-- 活动列表（SSR 预取） -->
    <section class="demo-section">
      <div class="section-header">
        <h2>🎉 活动列表（SSR 预取）</h2>
        <button
          @click="refreshSales"
          :disabled="salesLoading"
          class="refresh-btn"
        >
          <span v-if="salesLoading" class="btn-loading"></span>
          {{ salesLoading ? "刷新中..." : "🔄 刷新" }}
        </button>
      </div>
      <div v-if="salesLoading" class="loading">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>
      <div v-else-if="salesError" class="error">
        <p>❌ {{ salesError }}</p>
      </div>
      <div v-else class="sales-list">
        <div v-for="sale in sales" :key="sale.id" class="sale-card">
          <div class="sale-badge">
            {{
              sale.status === "active"
                ? "🔥 进行中"
                : sale.status === "upcoming"
                ? "⏰ 即将开始"
                : "✅ 已结束"
            }}
          </div>
          <div class="sale-info">
            <h3>{{ sale.title }}</h3>
            <p class="date">📅 {{ sale.startDate }} - {{ sale.endDate }}</p>
            <p class="discount">💥 折扣价: ¥{{ sale.discountPrice }}</p>
            <p v-if="sale.originalPrice" class="original-price">
              原价: ¥{{ sale.originalPrice }}
            </p>
          </div>
        </div>

        <!-- 分页控件 -->
        <div class="pagination">
          <button
            @click="goToPrevPage"
            :disabled="currentPage === 1"
            class="pagination-btn prev-btn"
          >
            ⬅️ 上一页
          </button>

          <div class="pagination-info">
            <span>第 {{ currentPage }} / {{ totalPages }} 页</span>
            <span class="total-count">共 {{ totalCount }} 条</span>
          </div>

          <button
            @click="goToNextPage"
            :disabled="currentPage === totalPages"
            class="pagination-btn next-btn"
          >
            下一页 ➡️
          </button>
        </div>
      </div>
    </section>

    <!-- SSR 信息展示 -->
    <section class="demo-section">
      <h2>📊 SSR 渲染信息</h2>
      <div class="info-grid">
        <div class="info-card">
          <h4>渲染方式</h4>
          <p class="value">
            {{ isServer ? "服务器端 (SSR)" : "客户端 (CSR)" }}
          </p>
        </div>
        <div class="info-card">
          <h4>数据来源</h4>
          <p class="value">服务器 API</p>
        </div>
        <div class="info-card">
          <h4>加载时间</h4>
          <p class="value">{{ loadTime }}ms</p>
        </div>
        <div class="info-card">
          <h4>产品数量</h4>
          <p class="value">{{ products.length }}</p>
        </div>
      </div>
    </section>

    <!-- useFetch 调用封装 API 演示 -->
    <section class="demo-section">
      <h2>🔧 useFetch 调用封装 API 演示</h2>

      <!-- 方法 1: 直接调用 API -->
      <div class="api-method">
        <h3>方法 1: 直接调用 API</h3>
        <div v-if="salesLoading" class="loading-small">
          <div class="spinner-small"></div>
          <p>加载中...</p>
        </div>
        <div v-else-if="salesError" class="error-small">
          <p>❌ {{ salesError }}</p>
        </div>
        <div v-else class="api-result">
          <p>成功获取 {{ sales?.length || 0 }} 个活动</p>
          <div class="mini-list">
            <div
              v-for="sale in sales?.slice(0, 3)"
              :key="sale.id"
              class="mini-item"
            >
              <span>{{ sale.title }}</span>
              <span class="status-badge">{{ sale.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 方法 2: useFetch 配合 $fetch -->
      <div class="api-method">
        <h3>方法 2: useFetch 配合 $fetch</h3>
        <div v-if="apiLoading" class="loading-small">
          <div class="spinner-small"></div>
          <p>加载中...</p>
        </div>
        <div v-else-if="apiError" class="error-small">
          <p>❌ {{ apiError }}</p>
        </div>
        <div v-else class="api-result">
          <p>成功获取 {{ productsFromApi?.length || 0 }} 个产品</p>
          <div class="mini-list">
            <div
              v-for="product in productsFromApi?.slice(0, 3)"
              :key="product.id"
              class="mini-item"
            >
              <span>{{ product.name }}</span>
              <span class="price-badge">¥{{ product.price }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 方法 3: useAsyncData 配合 API -->
      <div class="api-method">
        <h3>方法 3: useAsyncData 配合 API</h3>
        <div v-if="moduleLoading" class="loading-small">
          <div class="spinner-small"></div>
          <p>加载中...</p>
        </div>
        <div v-else-if="moduleError" class="error-small">
          <p>❌ {{ moduleError }}</p>
        </div>
        <div v-else class="api-result">
          <p>成功获取 {{ productsFromModule?.length || 0 }} 个产品</p>
          <div class="mini-list">
            <div
              v-for="product in productsFromModule"
              :key="product.id"
              class="mini-item"
            >
              <span>{{ product.name }}</span>
              <span class="price-badge">¥{{ product.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 使用说明 -->
    <section class="demo-section">
      <h2>💡 SSR 使用说明</h2>
      <div class="guide">
        <div class="guide-item">
          <h4>1. useAsyncData</h4>
          <p>在服务器端预取数据，页面加载时直接渲染</p>
          <pre><code>const { data, loading, error } = await useAsyncData(
  'products',
  () => $fetch('/api/products')
)</code></pre>
        </div>
        <div class="guide-item">
          <h4>2. useFetch</h4>
          <p>简化的 useAsyncData + $fetch 组合</p>
          <pre><code>const { data, loading, error } = await useFetch(
  '/api/products'
)</code></pre>
        </div>
        <div class="guide-item">
          <h4>3. 生命周期</h4>
          <p>onServerPrefetch: 仅在服务器端执行</p>
          <p>onMounted: 仅在客户端执行</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onServerPrefetch, computed } from "vue";
import type { Product, Sale } from "~/api/types";

// 服务器端检测
const isServer = process.server;
const loadTime = ref(0);

// 模拟 API 数据
const mockProducts: Product[] = [
  {
    id: 1,
    name: "商务名片",
    description: "高品质商务名片印刷",
    price: 88,
    category: "商务印刷",
    images: [],
    features: ["双面印刷", "铜版纸", "圆角处理"],
    specifications: {},
    stock: 100,
    sales: 500,
    rating: 4.8,
    reviewCount: 234,
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
  {
    id: 2,
    name: "宣传画册",
    description: "企业宣传画册设计印刷",
    price: 299,
    category: "商务印刷",
    images: [],
    features: ["全彩印刷", "铜版纸", "锁线装订"],
    specifications: {},
    stock: 50,
    sales: 234,
    rating: 4.9,
    reviewCount: 156,
    isActive: true,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-20",
  },
  {
    id: 3,
    name: "海报印刷",
    description: "高清海报印刷服务",
    price: 58,
    category: "广告印刷",
    images: [],
    features: ["大尺寸", "防水", "哑膜"],
    specifications: {},
    stock: 200,
    sales: 890,
    rating: 4.7,
    reviewCount: 345,
    isActive: true,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-25",
  },
  {
    id: 4,
    name: "包装设计",
    description: "产品包装设计印刷",
    price: 399,
    category: "包装印刷",
    images: [],
    features: ["创意设计", "环保材料", "定制尺寸"],
    specifications: {},
    stock: 30,
    sales: 123,
    rating: 4.6,
    reviewCount: 89,
    isActive: true,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-22",
  },
];

const mockSales: Sale[] = [
  {
    id: 1,
    slug: "new-year-sale",
    title: "新年特惠",
    description: "新年大促销，全场印刷产品8折优惠",
    type: "节日促销",
    startDate: "2024-01-01",
    endDate: "2024-01-15",
    discountPrice: 88,
    originalPrice: 110,
    discount: 20,
    status: "active",
    products: [1, 2, 3],
    image: "",
    isFeatured: true,
    createdAt: "2023-12-20",
    updatedAt: "2024-01-01",
  },
  {
    id: 2,
    slug: "spring-sale",
    title: "春季新品",
    description: "春季新品发布，定制包装设计75折",
    type: "新品上市",
    startDate: "2024-02-01",
    endDate: "2024-02-28",
    discountPrice: 225,
    originalPrice: 300,
    discount: 25,
    status: "upcoming",
    products: [4],
    image: "",
    isFeatured: true,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15",
  },
  {
    id: 3,
    slug: "anniversary-sale",
    title: "周年庆典",
    description: "公司周年庆，书籍装订买二送一",
    type: "限时折扣",
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    discountPrice: 200,
    discount: 30,
    status: "ended",
    products: [],
    image: "",
    isFeatured: false,
    createdAt: "2023-11-20",
    updatedAt: "2023-12-01",
  },
];

// 模拟 API 请求
const fetchSales = async (): Promise<Sale[]> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockSales;
};

// CSR: 在客户端获取数据（使用 onMounted）
const products = ref<Product[]>([]);
const loading = ref(false);
const error = ref("");

onMounted(async () => {
  loading.value = true;
  try {
    // 模拟网络请求（在客户端执行）
    const startTime = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 300));
    loadTime.value = Date.now() - startTime;

    products.value = mockProducts;
  } catch (err: any) {
    error.value = err.message || "加载失败";
  } finally {
    loading.value = false;
  }
});

// 分页状态管理（必须在 useFetch 之前定义）
const currentPage = ref(1);
const pageSize = ref(3); // 每页显示 3 条数据

// SSR 兼容：初始值设置为合理的默认值
// 因为首次渲染在服务器端，transform 函数在客户端执行
const totalPages = ref(4); // 12 条数据 / 每页 3 条 = 4 页
const totalCount = ref(12); // 总数据条数

// 使用 useFetch 调用封装好的 API（方法 1：直接调用）
const {
  data: sales,
  loading: salesLoading,
  error: salesError,
  refresh: refreshSalesData,
} = useFetch("/api/sales", {
  // 配置选项
  method: "GET",

  // 使用 computed 包装查询参数
  query: computed(() => {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
    };
    console.log("📤 发送的参数:", params);
    return params;
  }),

  // 监听依赖变化自动刷新
  watch: [currentPage, pageSize],

  // 数据转换
  transform: (response) => {
    // 服务器返回的结构: { code, message, data: { list, pagination } }
    console.log("🔄 Transform 函数 - 原始响应:", response);

    if (response.code === 200) {
      // 更新分页信息
      if (response.data.pagination) {
        console.log("📊 分页信息:", response.data.pagination);
        totalPages.value = response.data.pagination.totalPages;
        totalCount.value = response.data.pagination.total;
        console.log(
          "✅ 更新分页状态 - totalPages:",
          totalPages.value,
          ", totalCount:",
          totalCount.value
        );
      } else {
        console.warn("⚠️  没有分页信息");
      }
      return response.data.list;
    }
    return [];
  },

  // 响应处理
  onResponse({ response }) {
    console.log("Sales API Response:", response._data);
  },

  // 错误处理
  onResponseError({ response }) {
    console.error("Sales API Error:", response._data);
  },
});

// 刷新活动列表
const refreshSales = async () => {
  console.log("🔄 刷新活动列表...");
  await refreshSalesData();
  console.log("✅ 活动列表已刷新");
};

// 分页逻辑
const goToPage = (page: number) => {
  // 边界检查
  if (page < 1 || page > totalPages.value) return;

  console.log(`📄 跳转到第 ${page} 页`);
  currentPage.value = page;
  // watch 会自动刷新数据
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1);
  }
};

const goToPrevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1);
  }
};

// 使用 useFetch 配合封装的 API 函数（方法 2：推荐）
const {
  data: productsFromApi,
  loading: apiLoading,
  error: apiError,
} = await useFetch("/api/products", {
  // 使用 $fetch 直接调用
  $fetch: (url, options) => {
    return $fetch(url, {
      ...options,
      params: { page: 1, pageSize: 5 },
    });
  },

  // 转换数据
  transform: (response) => {
    if (response.code === 200) {
      return response.data.list;
    }
    return [];
  },
});

// 使用 useAsyncData 配合封装的 API 模块（方法 3：最灵活）
const {
  data: productsFromModule,
  loading: moduleLoading,
  error: moduleError,
} = await useAsyncData(
  "products-from-module",
  async () => {
    // 直接调用封装好的 API 函数
    const response = await $fetch("/api/products", {
      params: { page: 1, pageSize: 3 },
    });

    // 处理响应
    if (response.code === 200) {
      return response.data.list;
    }
    return [];
  },
  {
    server: true,
    watch: [],
  }
);

// 服务器端生命周期
onServerPrefetch(async () => {
  console.log("📡 服务器端预取数据...");
});

// 客户端生命周期
onMounted(() => {
  console.log("🌐 客户端挂载完成");
});

useHead({
  title: "SSR 演示 - RaceTopprint",
});
</script>

<style scoped>
.ssr-demo-container {
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

.demo-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.demo-section h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

/* 区域头部样式 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin-bottom: 0;
  border-bottom: none;
}

/* 刷新按钮样式 */
.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.refresh-btn:active:not(:disabled) {
  transform: translateY(0);
}

.refresh-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 按钮加载动画 */
.btn-loading {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.pagination-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.prev-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.next-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
}

.pagination-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.prev-btn:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.next-btn:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(245, 87, 108, 0.6);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.pagination-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.pagination-info span {
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 500;
}

.pagination-info .total-count {
  font-size: 0.85rem;
  color: #94a3b8;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error {
  padding: 20px;
  background: #fee2e2;
  border-radius: 8px;
  color: #dc2626;
  text-align: center;
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

.product-info h3 {
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
  margin-bottom: 5px;
}

.rating {
  font-size: 0.9rem;
  color: #f59e0b;
}

.sales-list {
  display: grid;
  gap: 15px;
}

.sale-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
  transition: all 0.3s;
}

.sale-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.sale-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.sale-badge:contains("进行中") {
  background: #fef3c7;
  color: #d97706;
}

.sale-badge:contains("即将开始") {
  background: #dbeafe;
  color: #2563eb;
}

.sale-badge:contains("已结束") {
  background: #f3f4f6;
  color: #6b7280;
}

.sale-info h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 8px;
}

.date {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 5px;
}

.discount {
  font-size: 1.1rem;
  font-weight: bold;
  color: #ef4444;
  margin-bottom: 5px;
}

.original-price {
  font-size: 0.9rem;
  color: #999;
  text-decoration: line-through;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-card {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.info-card h4 {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 10px;
}

.value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4f46e5;
}

.guide {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.guide-item {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #4f46e5;
}

.guide-item h4 {
  font-size: 1rem;
  color: #333;
  margin-bottom: 8px;
}

.guide-item p {
  color: #666;
  margin-bottom: 10px;
}

.guide-item pre {
  margin: 0;
  background: #1e293b;
  border-radius: 8px;
  overflow-x: auto;
}

.guide-item code {
  font-family: "Fira Code", "Monaco", "Consolas", monospace;
  font-size: 0.85rem;
  color: #e2e8f0;
  line-height: 1.6;
  display: block;
  padding: 15px;
}

/* API 调用演示样式 */
.api-method {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border-left: 4px solid #4f46e5;
}

.api-method h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 15px;
}

.loading-small {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-small {
  color: #dc2626;
  padding: 10px;
  background: #fee2e2;
  border-radius: 8px;
}

.api-result {
  color: #333;
}

.api-result p {
  margin-bottom: 10px;
  font-weight: 500;
}

/* CSR 提示样式 */
.csr-hint {
  margin-top: 20px;
  padding: 15px;
  background: #f0f9ff;
  border-left: 4px solid #0ea5e9;
  border-radius: 8px;
}

.csr-hint p {
  color: #0c4a6e;
  font-size: 0.95rem;
  margin: 0;
  font-weight: 500;
}

.mini-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mini-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge:contains("active") {
  background: #dcfce7;
  color: #166534;
}

.status-badge:contains("upcoming") {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge:contains("ended") {
  background: #f3f4f6;
  color: #4b5563;
}

.price-badge {
  padding: 2px 8px;
  background: #fef3c7;
  color: #d97706;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .ssr-demo-container {
    padding: 20px 15px;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }

  .sale-card {
    flex-direction: column;
  }

  .sale-badge {
    align-self: flex-start;
  }
}
</style>