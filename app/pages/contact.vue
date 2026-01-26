<template>
  <div class="container">
    <h1>联系我们</h1>
    <div class="contact-content">
      <div class="contact-info">
        <h2>联系方式</h2>
        <div class="info-item">
          <span class="label">地址：</span>
          <span>北京市朝阳区建国路 88 号</span>
        </div>
        <div class="info-item">
          <span class="label">电话：</span>
          <span>+86 123 4567 8900</span>
        </div>
        <div class="info-item">
          <span class="label">邮箱：</span>
          <span>info@racetopprint.com</span>
        </div>
        <div class="info-item">
          <span class="label">工作时间：</span>
          <span>周一至周五 9:00-18:00</span>
        </div>
      </div>
      <div class="contact-form">
        <h2>发送消息</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">姓名</label>
            <input type="text" id="name" v-model="form.name" required />
          </div>
          <div class="form-group">
            <label for="email">邮箱</label>
            <input type="email" id="email" v-model="form.email" required />
          </div>
          <div class="form-group">
            <label for="message">消息</label>
            <textarea id="message" v-model="form.message" rows="5" required></textarea>
          </div>
          <button type="submit" class="submit-btn">发送消息</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const form = ref({
  name: '',
  email: '',
  message: ''
})

const handleSubmit = () => {
  console.log('表单提交:', form.value)
  alert('消息已发送！我们会尽快回复您。')
  form.value = { name: '', email: '', message: '' }
}

useHead({
  title: '联系我们 - RaceTopprint',
  meta: [
    { name: 'description', content: '通过表单或联系方式与我们取得联系' }
  ]
})
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.contact-info,
.contact-form {
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
}

h2 {
  color: #4299e1;
  margin-bottom: 1.5rem;
}

.info-item {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.label {
  font-weight: bold;
  color: #333;
  margin-bottom: 0.25rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

input,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #4299e1;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover {
  background: #2b6cb0;
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
  }
}
</style>