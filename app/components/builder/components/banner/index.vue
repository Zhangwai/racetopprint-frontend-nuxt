<template>
  <div 
    class="banner"
    :style="containerStyle"
  >
    <img :src="image" :alt="title" class="banner-image" />
    
    <div v-if="overlay" class="banner-overlay" :style="overlayStyle"></div>
    
    <div class="banner-content" :style="contentStyle">
      <h2 v-if="title" class="banner-title" :style="titleStyle">{{ title }}</h2>
      <p v-if="subtitle" class="banner-subtitle" :style="subtitleStyle">{{ subtitle }}</p>
      
      <a 
        v-if="buttonText && buttonLink"
        :href="buttonLink"
        class="banner-button"
        :style="buttonStyle"
      >
        {{ buttonText }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  image: string
  title?: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
  backgroundColor?: string
  textColor?: string
  buttonColor?: string
  buttonTextColor?: string
  alignment?: 'left' | 'center' | 'right'
  overlay?: boolean
  overlayColor?: string
}>()

const containerStyle = computed(() => ({
  backgroundColor: props.backgroundColor || '#f0f0f0',
  position: 'relative',
  width: '100%',
  height: '400px',
  overflow: 'hidden'
}))

const overlayStyle = computed(() => ({
  backgroundColor: props.overlayColor || 'rgba(0, 0, 0, 0.3)',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1
}))

const contentStyle = computed(() => {
  const alignments: Record<string, string> = {
    'left': 'flex-start',
    'center': 'center',
    'right': 'flex-end'
  }
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: alignments[props.alignment || 'center'],
    padding: '40px',
    zIndex: 2
  }
})

const titleStyle = computed(() => ({
  color: props.textColor || '#333333',
  fontSize: '48px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
}))

const subtitleStyle = computed(() => ({
  color: props.textColor || '#333333',
  fontSize: '24px',
  margin: '0 0 24px 0',
  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
}))

const buttonStyle = computed(() => ({
  backgroundColor: props.buttonColor || '#4f46e5',
  color: props.buttonTextColor || '#ffffff',
  padding: '14px 32px',
  fontSize: '18px',
  fontWeight: '600',
  borderRadius: '50px',
  textDecoration: 'none',
  display: 'inline-block',
  transition: 'all 0.3s ease',
  cursor: 'pointer'
}))
</script>

<style scoped>
.banner {
  width: 100%;
  height: 400px;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.banner:hover .banner-image {
  transform: scale(1.05);
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.banner-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  z-index: 2;
}

.banner-title {
  font-size: 48px;
  font-weight: bold;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.banner-subtitle {
  font-size: 24px;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.banner-button {
  background-color: #4f46e5;
  color: #ffffff;
  padding: 14px 32px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 50px;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.banner-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.banner-button:active {
  transform: translateY(0);
}
</style>