// app/composables/useComponentRenderer.ts

import type { ComponentConfig, ComponentCondition, ComponentAnimation } from '~/types/component-builder'
import { loadComponentByType } from '~/composables/useComponentRegistry'

/**
 * 组件渲染引擎
 * 从组件注册中心获取组件导入映射表，避免重复维护
 */
export const useComponentRenderer = () => {
  // 直接使用组件注册中心的组件导入映射表
  // 这样新增组件时只需要在注册中心注册一次，不需要修改这里

  const loadComponent = async (type: string): Promise<any> => {
    // 委托给组件注册中心的 loadComponentByType 函数
    return await loadComponentByType(type)
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
    console.log(components,'components----------')

    for (const component of components) {
      try {
        // if (!await checkConditions(component.conditions)) {
        //   continue
        // }

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
