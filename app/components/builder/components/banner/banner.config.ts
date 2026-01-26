import type { ComponentDefinition } from '~/types/component-builder'

export const bannerConfig: ComponentDefinition = {
  type: 'banner',
  name: '广告横幅',
  icon: '📢',
  description: '广告横幅组件，支持图片、标题、按钮',
  category: 'promotion',
  defaultProps: {
    image: 'https://picsum.photos/1200/400?random=1',
    title: '限时优惠',
    subtitle: '全场低至 5 折',
    buttonText: '立即抢购',
    buttonLink: '/sale',
    backgroundColor: '#f0f0f0',
    textColor: '#333333',
    buttonColor: '#4f46e5',
    buttonTextColor: '#ffffff',
    alignment: 'center',
    overlay: true,
    overlayColor: 'rgba(0, 0, 0, 0.3)'
  },
  propertySchema: {
    image: {
      label: '广告图片',
      type: 'string',
      placeholder: '输入图片 URL',
      required: true
    },
    title: {
      label: '标题',
      type: 'string',
      placeholder: '输入标题',
      required: true
    },
    subtitle: {
      label: '副标题',
      type: 'string',
      placeholder: '输入副标题'
    },
    buttonText: {
      label: '按钮文字',
      type: 'string',
      placeholder: '输入按钮文字',
      default: '立即抢购'
    },
    buttonLink: {
      label: '按钮链接',
      type: 'string',
      placeholder: '输入链接地址',
      default: '/sale'
    },
    backgroundColor: {
      label: '背景颜色',
      type: 'color',
      default: '#f0f0f0'
    },
    textColor: {
      label: '文字颜色',
      type: 'color',
      default: '#333333'
    },
    buttonColor: {
      label: '按钮背景色',
      type: 'color',
      default: '#4f46e5'
    },
    buttonTextColor: {
      label: '按钮文字颜色',
      type: 'color',
      default: '#ffffff'
    },
    alignment: {
      label: '内容对齐',
      type: 'select',
      options: [
        { value: 'left', label: '左对齐' },
        { value: 'center', label: '居中对齐' },
        { value: 'right', label: '右对齐' }
      ],
      default: 'center'
    },
    overlay: {
      label: '显示遮罩',
      type: 'boolean',
      default: true
    },
    overlayColor: {
      label: '遮罩颜色',
      type: 'color',
      default: 'rgba(0, 0, 0, 0.3)'
    }
  },
  preview: 'https://picsum.photos/1200/400',
  tags: ['广告', '横幅', '促销', '按钮']
}