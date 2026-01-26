import type { ComponentDefinition } from '~/types/component-builder'

export const navbarConfig: ComponentDefinition = {
  type: 'navbar',
  name: '导航栏',
  icon: '🧭',
  description: '网站导航栏组件，支持 Logo、菜单、下拉菜单、搜索、购物车等功能',
  category: 'navigation',
  defaultProps: {
    logo: {
      text: '我的商城',
      image: ''
    },
    menuItems: [
      {
        label: '首页',
        url: '/'
      },
      {
        label: '商品分类',
        children: [
          { label: '服装', url: '/category/clothing' },
          { label: '电子产品', url: '/category/electronics' },
          { label: '家居用品', url: '/category/home' },
          { label: '运动户外', url: '/category/sports' }
        ]
      },
      {
        label: '限时优惠',
        url: '/sale'
      },
      {
        label: '关于我们',
        children: [
          { label: '公司简介', url: '/about/company' },
          { label: '联系我们', url: '/about/contact' },
          { label: '招聘信息', url: '/about/careers' }
        ]
      }
    ],
    showSearch: true,
    showCart: true,
    showUser: true,
    cartCount: 0,
    backgroundColor: '#ffffff',
    textColor: '#374151',
    hoverColor: '#4f46e5',
    dropdownBackgroundColor: '#ffffff',
    sticky: true,
    height: '60px'
  },
  propertySchema: {
    logo: {
      label: 'Logo 配置',
      type: 'object',
      properties: {
        image: {
          label: 'Logo 图片',
          type: 'string',
          placeholder: '输入 Logo 图片 URL'
        },
        text: {
          label: 'Logo 文字',
          type: 'string',
          placeholder: '输入 Logo 文字',
          default: '我的商城'
        }
      }
    },
    menuItems: {
      label: '导航菜单',
      type: 'array',
      itemSchema: {
        label: {
          label: '菜单项文字',
          type: 'string',
          placeholder: '输入菜单项文字',
          required: true
        },
        url: {
          label: '链接地址',
          type: 'string',
          placeholder: '输入链接地址'
        },
        children: {
          label: '子菜单',
          type: 'array',
          itemSchema: {
            label: {
              label: '子菜单项文字',
              type: 'string',
              placeholder: '输入子菜单项文字',
              required: true
            },
            url: {
              label: '链接地址',
              type: 'string',
              placeholder: '输入链接地址'
            }
          }
        }
      },
      required: true
    },
    showSearch: {
      label: '显示搜索按钮',
      type: 'boolean',
      default: true
    },
    showCart: {
      label: '显示购物车按钮',
      type: 'boolean',
      default: true
    },
    showUser: {
      label: '显示用户按钮',
      type: 'boolean',
      default: true
    },
    cartCount: {
      label: '购物车数量',
      type: 'number',
      min: 0,
      max: 99,
      default: 0
    },
    backgroundColor: {
      label: '背景颜色',
      type: 'color',
      default: '#ffffff'
    },
    textColor: {
      label: '文字颜色',
      type: 'color',
      default: '#374151'
    },
    hoverColor: {
      label: '悬停颜色',
      type: 'color',
      default: '#4f46e5'
    },
    dropdownBackgroundColor: {
      label: '下拉菜单背景色',
      type: 'color',
      default: '#ffffff'
    },
    sticky: {
      label: '固定顶部',
      type: 'boolean',
      default: true
    },
    height: {
      label: '导航栏高度',
      type: 'string',
      placeholder: '例如: 60px',
      default: '60px'
    }
  },
  preview: 'https://picsum.photos/800/100',
  tags: ['导航', '菜单', '下拉菜单', '购物车', '搜索', '头部']
}