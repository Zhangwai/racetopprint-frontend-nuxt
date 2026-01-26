<template>
  <nav class="navbar" :style="containerStyle">
    <div class="navbar-container">
      <!-- Logo -->
      <div v-if="logo" class="navbar-logo" @click="$emit('logo-click')">
        <img v-if="logo.image" :src="logo.image" :alt="logo.text" class="logo-image" />
        <span v-if="logo.text" class="logo-text">{{ logo.text }}</span>
      </div>

      <!-- 导航菜单 -->
      <div class="navbar-menu">
        <div
          v-for="(item, index) in menuItems"
          :key="index"
          class="nav-item"
          :class="{ 'has-dropdown': item.children && item.children.length > 0 }"
          @mouseenter="activeDropdown = index"
          @mouseleave="activeDropdown = null"
        >
          <a 
            :href="item.url || '#'" 
            class="nav-link"
            @click.stop="$emit('nav-item-click', item)"
          >
            {{ item.label }}
            <span v-if="item.children && item.children.length > 0" class="dropdown-arrow">▼</span>
          </a>

          <!-- 下拉菜单 -->
          <div 
            v-if="item.children && item.children.length > 0"
            class="dropdown-menu"
            :class="{ show: activeDropdown === index }"
          >
            <a
              v-for="(child, childIndex) in item.children"
              :key="childIndex"
              :href="child.url || '#'"
              class="dropdown-item"
              @click.stop="$emit('dropdown-item-click', child)"
            >
              {{ child.label }}
            </a>
          </div>
        </div>
      </div>

      <!-- 右侧操作区 -->
      <div class="navbar-actions">
        <button
          v-if="showSearch"
          class="navbar-action search-btn"
          @click="$emit('search-click')"
        >
            🔍
        </button>
        <button
          v-if="showCart"
          class="navbar-action cart-btn"
          @click="$emit('cart-click')"
        >
            🛒
            <span v-if="cartCount > 0" class="cart-count">{{ cartCount }}</span>
        </button>
        <button
          v-if="showUser"
          class="navbar-action user-btn"
          @click="$emit('user-click')"
        >
            👤
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  // Logo 配置
  logo?: {
    image?: string
    text?: string
  }
  
  // 菜单项
  menuItems?: Array<{
    label: string
    url?: string
    children?: Array<{
      label: string
      url?: string
    }>
  }>
  
  // 显示选项
  showSearch?: boolean
  showCart?: boolean
  showUser?: boolean
  
  // 购物车数量
  cartCount?: number
  
  // 样式配置
  backgroundColor?: string
  textColor?: string
  hoverColor?: string
  dropdownBackgroundColor?: string
  sticky?: boolean
  height?: string
}>()

defineEmits<{
  (e: 'logo-click'): void
  (e: 'nav-item-click', item: any): void
  (e: 'dropdown-item-click', item: any): void
  (e: 'search-click'): void
  (e: 'cart-click'): void
  (e: 'user-click'): void
}>()

const activeDropdown = ref<number | null>(null)

const containerStyle = computed(() => ({
  backgroundColor: props.backgroundColor || '#ffffff',
  position: props.sticky ? 'sticky' : 'relative',
  top: props.sticky ? '0' : 'auto',
  zIndex: props.sticky ? '1000' : 'auto',
  height: props.height || '60px'
}))
</script>

<style scoped>
.navbar {
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

/* Logo */
.navbar-logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.3s;
}

.navbar-logo:hover {
  opacity: 0.8;
}

.logo-image {
  height: 40px;
  margin-right: 10px;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
}

/* 导航菜单 */
.navbar-menu {
  display: flex;
  gap: 30px;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  color: #374151;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s;
}

.nav-link:hover {
  color: #4f46e5;
  background-color: #f3f4f6;
}

.dropdown-arrow {
  font-size: 12px;
  transition: transform 0.3s;
}

.nav-item:hover .dropdown-arrow {
  transform: rotate(180deg);
}

/* 下拉菜单 */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s;
  z-index: 1001;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: block;
  padding: 12px 20px;
  text-decoration: none;
  color: #374151;
  font-size: 14px;
  transition: background-color 0.3s;
}

.dropdown-item:hover {
  background-color: #f9fafb;
  color: #4f46e5;
}

/* 右侧操作区 */
.navbar-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.navbar-action {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s;
  position: relative;
}

.navbar-action:hover {
  background-color: #f3f4f6;
  transform: scale(1.1);
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ef4444;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    padding: 10px;
  }

  .navbar-menu {
    flex-direction: column;
    gap: 10px;
    margin: 10px 0;
  }

  .navbar-actions {
    margin-top: 10px;
  }
}
</style>