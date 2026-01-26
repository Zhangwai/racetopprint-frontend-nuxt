<template>
  <div class="container">
    <h1>欢迎来到首页</h1>
    <p>这是一个使用 Nuxt 3 构建的应用程序</p>
    <div class="nav-links">
      <NuxtLink to="/about">关于我们</NuxtLink>
      <NuxtLink to="/contact">联系我们</NuxtLink>
      <NuxtLink to="/products">产品列表</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '首页 - RaceTopprint',
  meta: [
    { name: 'description', content: '欢迎来到 RaceTopprint 首页' }
  ]
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 1rem;
}

p {
  color: #666;
  margin-bottom: 2rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-links a {
  padding: 0.75rem 1.5rem;
  background: #4299e1;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background 0.3s;
}

.nav-links a:hover {
  background: #2b6cb0;
}
</style>