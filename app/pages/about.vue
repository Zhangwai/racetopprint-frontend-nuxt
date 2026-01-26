<template>
  <div class="container">
    <h1>关于我们</h1>
    <div class="about-content">
      <section>
        <h2>我们的故事</h2>
        <p>RaceTopprint 成立于 2024 年，致力于提供高品质的印刷解决方案。</p>
      </section>
      <section>
        <h2>我们的使命</h2>
        <p>通过创新技术和优质服务，帮助客户实现他们的创意愿景。</p>
      </section>
      <section>
        <h2>联系方式</h2>
        <p>邮箱: info@racetopprint.com</p>
        <p>电话: +86 123 4567 8900</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '关于我们 - RaceTopprint',
  meta: [
    { name: 'description', content: '了解 RaceTopprint 的故事和使命' }
  ]
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

section {
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 8px;
}

h2 {
  color: #4299e1;
  margin-bottom: 1rem;
}

p {
  color: #666;
  line-height: 1.6;
}
</style>