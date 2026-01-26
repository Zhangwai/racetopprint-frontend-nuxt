<template>
  <div class="carousel" :style="containerStyle">
    <div 
      class="carousel-track" 
      :style="trackStyle"
      ref="trackRef"
    >
      <div
        v-for="(image, index) in images"
        :key="index"
        class="carousel-slide"
        :style="slideStyle"
      >
        <img :src="image.src" :alt="image.alt || `Slide ${index + 1}`" />
        <div v-if="image.title" class="slide-title">{{ image.title }}</div>
        <div v-if="image.description" class="slide-description">{{ image.description }}</div>
      </div>
    </div>
    
    <button 
      v-if="showArrows"
      class="carousel-arrow prev"
      @click="prevSlide"
    >
      ◀
    </button>
    <button 
      v-if="showArrows"
      class="carousel-arrow next"
      @click="nextSlide"
    >
      ▶
    </button>
    
    <div v-if="showIndicators" class="carousel-indicators">
      <button
        v-for="(image, index) in images"
        :key="index"
        class="indicator"
        :class="{ active: currentIndex === index }"
        @click="goToSlide(index)"
      >
        {{ index + 1 }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  images: Array<{
    src: string
    alt?: string
    title?: string
    description?: string
  }>
  autoplay?: boolean
  interval?: number
  showIndicators?: boolean
  showArrows?: boolean
  height?: string
}>()

const currentIndex = ref(0)
const trackRef = ref<HTMLElement | null>(null)
const intervalId = ref<NodeJS.Timeout | null>(null)

const containerStyle = computed(() => ({
  height: props.height || '400px'
}))

const trackStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * 100}%)`,
  transition: props.autoplay !== false ? 'transform 0.3s ease' : 'none'
}))

const slideStyle = computed(() => ({
  width: `${100 / props.images.length}%`
}))

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

const goToSlide = (index: number) => {
  currentIndex.value = index
}

onMounted(() => {
  if (props.autoplay !== false) {
    intervalId.value = setInterval(() => {
      nextSlide()
    }, props.interval || 3000)
  }
})

onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
})
</script>

<style scoped>
.carousel {
  width: 100%;
  height: 400px;
  overflow: hidden;
  position: relative;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.carousel-track {
  display: flex;
  height: 100%;
  transition: transform 0.3s ease;
}

.carousel-slide {
  min-width: 100%;
  height: 100%;
  position: relative;
}

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-title {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  font-size: 24px;
  font-weight: bold;
  border-radius: 4px;
}

.slide-description {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 15px;
  font-size: 24px;
  cursor: pointer;
  z-index: 10;
  border-radius: 50%;
  transition: background 0.3s;
}

.carousel-arrow:hover {
  background: rgba(0, 0, 0, 0.8);
}

.carousel-arrow.prev {
  left: 15px;
}

.carousel-arrow.next {
  right: 15px;
}

.carousel-indicators {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.indicator {
  background: rgba(255, 255, 255, 0.5);
  color: black;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.3s;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.8);
}

.indicator.active {
  background: white;
  font-weight: bold;
}
</style>