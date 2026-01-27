<template>
  <div class="component-renderer">
    <div
      v-for="(rendered, index) in renderedComponents"
      :key="rendered.config.id"
      class="rendered-component"
      :class="[
        rendered.customClass,
        `component-${rendered.config.type}`,
      ]"
      :style="rendered.style"
      :data-component-id="rendered.config.id"
      :data-component-type="rendered.config.type"
    >
      <component
        :is="rendered.Component"
        v-bind="rendered.props"
        :key="rendered.config.id"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComponentConfig } from '~/types/component-builder'
import { useComponentRenderer } from '~/composables/useComponentRenderer'

const props = defineProps<{
  components: ComponentConfig[]
}>()

const { renderComponents } = useComponentRenderer()

const renderedComponents = ref<Awaited<ReturnType<typeof renderComponents>>>([])

onMounted(async () => {
  console.log('ComponentRenderer mounted, components:', props.components)
  renderedComponents.value = await renderComponents(props.components)
  console.log('ComponentRenderer - Rendered components:', renderedComponents.value)
})

watch(() => props.components, async (newComponents) => {
  console.log('ComponentRenderer - Components changed:', newComponents)
  renderedComponents.value = await renderComponents(newComponents)
  console.log('ComponentRenderer - Rendered components updated:', renderedComponents.value)
}, { deep: true })
</script>

<style scoped>
.component-renderer {
  width: 100%;
  min-height: 100%;
}

.rendered-component {
  width: 100%;
  transition: all 0.3s ease;
}

/* 组件类型特定样式 */
.component-carousel {
  /* 轮播图组件样式 */
}

.component-product-list {
  /* 商品列表组件样式 */
}

.component-navbar {
  /* 导航栏组件样式 */
}

.component-banner {
  /* 横幅组件样式 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .component-renderer {
    padding: 0 10px;
  }

  .rendered-component {
    margin-bottom: 15px;
  }
}

@media (max-width: 480px) {
  .component-renderer {
    padding: 0 5px;
  }
}
</style>
