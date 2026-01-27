<template>
  <div class="test-page-container">
    <h1>📋 前台页面渲染测试</h1>
    <p>本页面用于测试前台页面渲染功能</p>

    <div class="test-section">
      <h2>🎯 测试步骤</h2>
      <ol>
        <li>
          <span>1. 创建页面</span>
          <p>访问 <a href="/pages" target="_blank">页面管理</a>，创建一个新页面</p>
        </li>
        <li>
          <span>2. 编辑页面</span>
          <p>点击页面的"编辑"按钮，进入页面编辑器</p>
        </li>
        <li>
          <span>3. 添加组件</span>
          <p>从左侧组件库拖拽组件到画布中</p>
        </li>
        <li>
          <span>4. 发布页面</span>
          <p>点击"发布"按钮，将页面发布到线上</p>
        </li>
        <li>
          <span>5. 访问前台页面</span>
          <p>访问 <code>/page/[页面路径]</code> 查看前台渲染效果</p>
        </li>
      </ol>
    </div>

    <div class="test-section">
      <h2>🔗 测试页面示例</h2>
      <div class="page-list">
        <div class="page-item">
          <h3>商品列表页</h3>
          <p>路径: /page/products</p>
          <NuxtLink to="/page/products" class="btn btn-primary">
            访问页面
          </NuxtLink>
        </div>
        <div class="page-item">
          <h3>关于我们</h3>
          <p>路径: /page/about</p>
          <NuxtLink to="/page/about" class="btn btn-primary">
            访问页面
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="test-section">
      <h2>📚 技术说明</h2>
      <div class="tech-info">
        <div class="tech-item">
          <h4>🔧 页面渲染流程</h4>
          <ol>
            <li>服务器端预取页面配置（SSR）</li>
            <li>获取页面组件列表</li>
            <li>动态加载组件</li>
            <li>渲染组件到页面</li>
          </ol>
        </div>

        <div class="tech-item">
          <h4>🎨 组件渲染引擎</h4>
          <p>使用 ComponentRenderer 组件动态渲染所有页面组件</p>
          <ul>
            <li>支持所有已注册的组件</li>
            <li>自动应用组件属性和样式</li>
            <li>响应式设计，支持移动端</li>
          </ul>
        </div>

        <div class="tech-item">
          <h4>💾 数据持久化</h4>
          <p>页面配置数据存储在 Pinia Store 中，并持久化到 localStorage</p>
        </div>
      </div>
    </div>

    <div class="test-section">
      <h2>✅ 已完成的功能</h2>
      <ul class="feature-list">
        <li>
          <span>✅ 前台页面路由</span>
          <p>创建了动态路由 /page/[slug]</p>
        </li>
        <li>
          <span>✅ 页面配置 API</span>
          <p>实现了 /api/pages/[slug] 接口</p>
        </li>
        <li>
          <span>✅ 组件渲染器</span>
          <p>创建了 ComponentRenderer 组件</p>
        </li>
        <li>
          <span>✅ SSR 预取</span>
          <p>使用 useFetch 在服务器端预取数据</p>
        </li>
        <li>
          <span>✅ 错误处理</span>
          <p>完善的错误处理和加载状态</p>
        </li>
      </ul>
    </div>

    <div class="test-section">
      <h2>🔍 调试信息</h2>
      <div class="debug-info">
        <p><strong>当前页面路径:</strong> {{ currentPath }}</p>
        <p><strong>页面配置:</strong> {{ pageConfig ? '已加载' : '未加载' }}</p>
        <p><strong>组件数量:</strong> {{ pageConfig?.components.length || 0 }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentPath = ref(window.location.pathname)
const pageConfig = ref(null)

useHead({
  title: '前台页面渲染测试 - RaceTopprint',
})
</script>

<style scoped>
.test-page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  color: #2d3748;
  margin-bottom: 10px;
}

h2 {
  color: #2d3748;
  margin: 30px 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #e2e8f0;
}

p {
  color: #4a5568;
  line-height: 1.6;
}

.test-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.test-section ol {
  padding-left: 20px;
}

.test-section li {
  margin-bottom: 20px;
  color: #4a5568;
  line-height: 1.6;
}

.test-section li span {
  font-weight: bold;
  color: #2b6cb0;
  display: block;
  margin-bottom: 5px;
}

.test-section li p {
  margin: 5px 0 0 0;
  color: #718096;
}

.test-section a {
  color: #4299e1;
  text-decoration: none;
}

.test-section a:hover {
  text-decoration: underline;
}

.page-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.page-item {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.page-item h3 {
  margin: 0 0 10px 0;
  color: #2d3748;
}

.page-item p {
  margin: 0 0 15px 0;
  color: #718096;
  font-size: 14px;
}

.page-item code {
  background: #e2e8f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #4299e1;
  color: white;
}

.btn-primary:hover {
  background: #2b6cb0;
}

.tech-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.tech-item {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
}

.tech-item h4 {
  margin: 0 0 15px 0;
  color: #2d3748;
}

.tech-item ol,
.tech-item ul {
  margin: 0;
  padding-left: 20px;
}

.tech-item li {
  margin-bottom: 8px;
  color: #4a5568;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 10px;
}

.feature-list li span {
  font-weight: bold;
  color: #2f855a;
  min-width: 200px;
}

.feature-list li p {
  margin: 0;
  color: #718096;
  flex: 1;
}

.debug-info {
  background: #ebf8ff;
  border: 1px solid #90cdf4;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.debug-info p {
  margin: 8px 0;
  color: #2c5282;
}

.debug-info strong {
  color: #2b6cb0;
}
</style>
