<template>
  <div class="user-container">
    <!-- 用户信息卡片 -->
    <ClientOnly>
      <div class="user-card" v-if="isLoggedIn">
        <div class="user-avatar">
          <img :src="avatarUrl" :alt="displayName" />
        </div>
        <div class="user-info">
          <h2>{{ displayName }}</h2>
          <p class="email">{{ email }}</p>
          <p class="user-id">ID: {{ id }}</p>
        </div>
        <button @click="handleLogout" class="btn btn-danger" :disabled="isLoading">
          {{ isLoading ? '登出中...' : '登出' }}
        </button>
      </div>

      <!-- 登录表单 -->
      <div class="login-form" v-else>
        <h2>用户登录</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">邮箱</label>
            <input
              id="email"
              v-model="loginForm.email"
              type="email"
              placeholder="请输入邮箱"
              required
            />
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
        </form>

        <!-- 测试账户 -->
        <div class="test-accounts">
          <h4>测试账户</h4>
          <div class="test-account" @click="fillTestAccount('user@example.com', '123456')">
            <span>普通用户</span>
            <code>user@example.com / 123456</code>
          </div>
          <div class="test-account" @click="fillTestAccount('admin@example.com', 'admin123')">
            <span>管理员</span>
            <code>admin@example.com / admin123</code>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- 用户设置 -->
    <div class="user-settings" v-if="isLoggedIn">
      <h3>用户设置</h3>

      <!-- 主题设置 -->
      <div class="setting-item">
        <label>主题</label>
        <div class="theme-buttons">
          <button
            @click="updateSettings({ theme: 'light' })"
            :class="['theme-btn', { active: settings.theme === 'light' }]"
          >
            ☀️ 亮色
          </button>
          <button
            @click="updateSettings({ theme: 'dark' })"
            :class="['theme-btn', { active: settings.theme === 'dark' }]"
          >
            🌙 暗色
          </button>
          <button
            @click="updateSettings({ theme: 'auto' })"
            :class="['theme-btn', { active: settings.theme === 'auto' }]"
          >
            🤖 自动
          </button>
        </div>
        <button @click="toggleTheme" class="btn btn-secondary">
          🔄 切换主题
        </button>
      </div>

      <!-- 语言设置 -->
      <div class="setting-item">
        <label>语言</label>
        <select :value="settings.language" @change="handleLanguageChange">
          <option value="zh-CN">简体中文</option>
          <option value="en-US">English</option>
        </select>
      </div>

      <!-- 通知设置 -->
      <div class="setting-item">
        <label>通知设置</label>
        <div class="checkbox-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              :checked="settings.notifications"
              @change="updateSettings({ notifications: !settings.notifications })"
            />
            <span>启用应用通知</span>
          </label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              :checked="settings.emailNotifications"
              @change="updateSettings({ emailNotifications: !settings.emailNotifications })"
            />
            <span>启用邮件通知</span>
          </label>
        </div>
      </div>

      <!-- 更新用户信息 -->
      <div class="setting-item">
        <label>更新用户信息</label>
        <div class="form-group">
          <input
            v-model="updateForm.name"
            type="text"
            placeholder="输入新名称"
          />
        </div>
        <button @click="handleUpdateUserInfo" class="btn btn-primary">
          更新名称
        </button>
      </div>
    </div>

    <!-- 持久化信息 -->
    <div class="persist-info">
      <h3>💾 持久化信息</h3>
      <p>用户信息已自动持久化到 localStorage</p>
      <p>刷新页面后，登录状态会自动恢复</p>
      <div class="storage-key">
        <strong>Storage Key:</strong> <code>user_store</code>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserManager } from '~/composables/useUserManager'

const userManager = useUserManager()

// 解构响应式属性
const {
  id,
  name,
  email,
  avatar,
  settings,
  isLoggedIn,
  isLoading,
  displayName,
  avatarUrl,
  updateSettings,
  toggleTheme,
} = userManager

// 登录表单
const loginForm = ref({
  email: '',
  password: '',
})

// 更新表单
const updateForm = ref({
  name: '',
})

// 登录处理
const handleLogin = async () => {
  try {
    await userManager.login(loginForm.value)
    alert('✅ 登录成功！')
  } catch (error) {
    alert('❌ 登录失败！')
  }
}

// 登出处理
const handleLogout = async () => {
  try {
    await userManager.logout()
    alert('✅ 登出成功！')
  } catch (error) {
    alert('❌ 登出失败！')
  }
}

// 填充测试账户
const fillTestAccount = (email: string, password: string) => {
  loginForm.value.email = email
  loginForm.value.password = password
}

// 语言变更处理
const handleLanguageChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  userManager.updateSettings({ language: target.value as 'zh-CN' | 'en-US' })
}

// 更新用户信息
const handleUpdateUserInfo = async () => {
  if (!updateForm.value.name) {
    alert('请输入名称')
    return
  }
  try {
    await userManager.updateUserInfo({ name: updateForm.value.name })
    updateForm.value.name = ''
    alert('✅ 用户信息已更新！')
  } catch (error) {
    alert('❌ 更新失败！')
  }
}

// 页面加载时初始化用户
onMounted(() => {
  userManager.initUser()
})

// 设置页面标题
useHead({
  title: '用户中心 - RaceTopprint',
})
</script>

<style scoped>
.user-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.user-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-info h2 {
  margin: 0 0 10px 0;
  color: #333;
}

.user-info .email {
  color: #666;
  margin: 5px 0;
}

.user-info .user-id {
  color: #999;
  font-size: 14px;
  margin: 5px 0;
}

.login-form {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-form h2 {
  margin: 0 0 20px 0;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #4299e1;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #4299e1;
  color: white;
  width: 100%;
}

.btn-primary:hover:not(:disabled) {
  background: #2b6cb0;
}

.btn-danger {
  background: #e53e3e;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c53030;
}

.btn-secondary {
  background: #718096;
  color: white;
  padding: 8px 16px;
  font-size: 14px;
}

.btn-secondary:hover:not(:disabled) {
  background: #4a5568;
}

.test-accounts {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.test-accounts h4 {
  margin: 0 0 15px 0;
  color: #666;
}

.test-account {
  padding: 10px;
  background: #f7fafc;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.test-account:hover {
  background: #edf2f7;
}

.test-account span {
  font-weight: 500;
  color: #333;
}

.test-account code {
  background: #e2e8f0;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.user-settings {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.user-settings h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.setting-item {
  margin-bottom: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid #eee;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item label {
  display: block;
  margin-bottom: 10px;
  color: #333;
  font-weight: 500;
}

.theme-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.theme-btn {
  padding: 10px 20px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.theme-btn:hover {
  border-color: #4299e1;
}

.theme-btn.active {
  background: #4299e1;
  color: white;
  border-color: #4299e1;
}

.setting-item select {
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.checkbox-label input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.persist-info {
  background: #ebf8ff;
  border: 1px solid #90cdf4;
  border-radius: 12px;
  padding: 20px;
}

.persist-info h3 {
  margin: 0 0 10px 0;
  color: #2c5282;
}

.persist-info p {
  margin: 5px 0;
  color: #2b6cb0;
}

.storage-key {
  margin-top: 15px;
  padding: 10px;
  background: white;
  border-radius: 8px;
}

.storage-key code {
  background: #e2e8f0;
  padding: 2px 8px;
  border-radius: 4px;
}
</style>
