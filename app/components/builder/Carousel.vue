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
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
}

.carousel-track {
  display: flex;
  height: 100%;
}

.carousel-slide {
  position: relative;
  height: 100%;
  flex-shrink: 0;
}

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-title {
  position: absolute;
  bottom: 60px;
  left: 20px;
  color: white;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.slide-description {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  font-size: 14px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 20px;
  cursor: pointer;
  z-index: 10;
  transition: background-color 0.2s;
}

.carousel-arrow:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.carousel-arrow.prev {
  left: 10px;
}

.carousel-arrow.next {
  right: 10px;
}

.carousel-indicators {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.indicator {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  color: black;
  cursor: pointer;
  transition: all 0.2s;
}

.indicator:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.indicator.active {
  background-color: white;
  font-weight: bold;
}
</style>
