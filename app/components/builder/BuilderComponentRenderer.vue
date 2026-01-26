<template>
  <div class="component-renderer">
    <div v-for="(rendered, index) in renderedComponents" :key="rendered.config.id" class="rendered-component"
      :class="[rendered.customClass, `component-${rendered.config.type}`]" :style="rendered.style"
      :data-component-id="rendered.config.id" :data-component-type="rendered.config.type">
      <component :is="rendered.Component" v-bind="rendered.props" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComponentConfig } from '~/types/component-builder'

const props = defineProps<{
  components: ComponentConfig[]
}>()

const { renderComponents } = useComponentRenderer()

const renderedComponents = ref<Awaited<ReturnType<typeof renderComponents>>>([])

onMounted(async () => {
  console.log('BuilderComponentRenderer mounted, components:', props.components)
  renderedComponents.value = await renderComponents(props.components)
  console.log('BuilderComponentRenderer - Rendered components:', renderedComponents.value)
})

watch(() => props.components, async (newComponents) => {
  console.log('BuilderComponentRenderer - Components changed:', newComponents)
  renderedComponents.value = await renderComponents(newComponents)
  console.log('BuilderComponentRenderer - Rendered components updated:', renderedComponents.value)
}, { deep: true })
</script>

<style scoped>
.component-renderer {
  width: 100%;
}

.rendered-component {
  margin-bottom: 20px;
}
</style>
