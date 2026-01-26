// app/composables/useComponentRenderer.ts

import type { ComponentConfig, ComponentCondition, ComponentAnimation } from '~/types/component-builder'

/**
 * 组件渲染引擎
 */
export const useComponentRenderer = () => {
  const componentImports: Record<string, () => Promise<{ default: any }>> = {
    'carousel': () => import('~/components/builder/Carousel.vue'),
    'product-list': () => import('~/components/builder/ProductList.vue')
  }

  const loadComponent = async (type: string): Promise<any> => {
    const loader = componentImports[type]
    if (!loader) {
      console.warn(`Component type "${type}" not found`)
      return null
    }
    try {
      const module = await loader()
      return module.default
    } catch (error) {
      console.error(`Failed to load component "${type}":`, error)
      return null
    }
  }

  const renderComponent = async (component: ComponentConfig) => {
    const Component = await loadComponent(component.type)
    if (!Component) return null

    return {
      Component,
      props: component.props,
      style: component.style,
      customClass: component.customClass
    }
  }

  const renderComponents = async (components: ComponentConfig[]) => {
    const renderedComponents = []

    for (const component of components) {
      try {
        if (!await checkConditions(component.conditions)) {
          continue
        }

        const rendered = await renderComponent(component)
        if (rendered) {
          renderedComponents.push({
            ...rendered,
            config: component
          })
        }
      } catch (error) {
        console.error(`Failed to render component "${component.type}":`, error)
      }
    }

    return renderedComponents
  }

  const checkConditions = async (conditions?: ComponentCondition[]): Promise<boolean> => {
    if (!conditions || conditions.length === 0) return true

    for (const condition of conditions) {
      switch (condition.type) {
        case 'user_role':
          const user = useAuth().user
          if (user && user.role !== condition.value) {
            return false
          }
          break
        case 'time_range':
          const now = new Date()
          const startTime = new Date(condition.value.start)
          const endTime = new Date(condition.value.end)
          if (now < startTime || now > endTime) {
            return false
          }
          break
        case 'device':
          const device = useDevice().type
          if (device !== condition.value) {
            return false
          }
          break
        case 'location':
          const location = useLocation()
          if (location && location.region !== condition.value) {
            return false
          }
          break
        case 'custom':
          if (!await condition.value()) {
            return false
          }
          break
      }
    }

    return true
  }

  return {
    loadComponent,
    renderComponent,
    renderComponents,
    checkConditions
  }
}

// 辅助 composables（需要实现）
const useAuth = () => ({ user: null })
const useDevice = () => ({ type: 'desktop' })
const useLocation = () => null
