// app/components/builder/components/index.ts
// 组件注册中心 - 只维护组件目录列表

// 定义组件目录结构
export interface ComponentDirectory {
  name: string // 目录名，也作为组件类型
  path: string // 相对路径
}

// 所有组件目录列表 - 这里只需维护目录名即可
// 新增组件时只需在这里添加目录名
const componentDirectories: ComponentDirectory[] = [
  { name: 'banner', path: 'builder/components/banner' },
  { name: 'carousel', path: 'builder/components/carousel' },
  { name: 'product-list', path: 'builder/components/product-list' },
  { name: 'navbar', path: 'builder/components/navbar' },
  // 添加新组件时只需在这里添加目录名
  // 示例: { name: 'new-component', path: 'builder/components/new-component' }
]

// 导出组件目录列表
export { componentDirectories }
