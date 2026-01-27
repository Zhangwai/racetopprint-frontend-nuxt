<template>
  <div class="layout">
    <header class="header">
      <div class="container">
        <NuxtLink to="/" class="logo">
          <h1>RaceTopprint</h1>
        </NuxtLink>
        <nav class="nav">
          <NuxtLink to="/" class="nav-link" active-class="active">
            首页
          </NuxtLink>
          <NuxtLink to="/about" class="nav-link" active-class="active">
            关于我们
          </NuxtLink>
          <NuxtLink to="/products" class="nav-link" active-class="active">
            产品
          </NuxtLink>
          <NuxtLink to="/sale" class="nav-link nav-link--sale" active-class="active">
            🔥 活动
          </NuxtLink>
          <NuxtLink to="/contact" class="nav-link" active-class="active">
            联系我们
          </NuxtLink>
          <NuxtLink to="/user" class="nav-link" active-class="active">
            👤 用户中心
          </NuxtLink>
        </nav>
      </div>
    </header>
    
    <main class="main">
      <slot />
    </main>
    
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>RaceTopprint</h3>
            <p>高品质印刷解决方案提供商</p>
          </div>
          <div class="footer-section">
            <h4>快速链接</h4>
            <ul>
              <li><NuxtLink to="/">首页</NuxtLink></li>
              <li><NuxtLink to="/about">关于我们</NuxtLink></li>
              <li><NuxtLink to="/products">产品</NuxtLink></li>
              <li><NuxtLink to="/sale">限时活动</NuxtLink></li>
              <li><NuxtLink to="/contact">联系我们</NuxtLink></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>联系方式</h4>
            <p>邮箱: info@racetopprint.com</p>
            <p>电话: +86 123 4567 8900</p>
            <p>地址: 北京市朝阳区建国路 88 号</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 RaceTopprint. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'zh-CN'
  }
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #2d3748;
  color: white;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  color: white;
}

.logo {
  text-decoration: none;
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #cbd5e0;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover,
.nav-link.active {
  color: #4299e1;
}

.nav-link--sale {
  color: #f56565;
  animation: pulse 2s infinite;
}

.nav-link--sale:hover,
.nav-link--sale.active {
  color: #e53e3e;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.main {
  flex: 1;
  padding: 2rem 0;
}

.footer {
  background: #1a202c;
  color: white;
  padding: 3rem 0 1rem;
  margin-top: auto;
}

.footer .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 1rem;
  color: #4299e1;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: #cbd5e0;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: #4299e1;
}

.footer-bottom {
  border-top: 1px solid #2d3748;
  padding-top: 1rem;
  text-align: center;
  color: #a0aec0;
}

@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav {
    gap: 1rem;
  }
}
</style>