import type { ComponentDefinition } from '~/types/component-builder'

export const carouselConfig: ComponentDefinition = {
  type: 'carousel',
  name: '轮播图',
  icon: '🎠',
  description: '图片轮播组件，支持自动播放、指示器、箭头',
  category: 'content',
  defaultProps: {
    images: [
      {
        src: 'https://picsum.photos/800/400?random=1',
        alt: '轮播图 1',
        title: '夏季新品上市',
        description: '全场低至 5 折'
      },
      {
        src: 'https://picsum.photos/800/400?random=2',
        alt: '轮播图 2',
        title: '限时优惠',
        description: '满 199 减 50'
      },
      {
        src: 'https://picsum.photos/800/400?random=3',
        alt: '轮播图 3',
        title: '热销爆款',
        description: '已售 1000+'
      }
    ],
    autoplay: true,
    interval: 3000,
    showIndicators: true,
    showArrows: true,
    height: '400px',
    transition: 'fade',
    pauseOnHover: true
  },
  propertySchema: {
    images: {
      label: '轮播图片',
      type: 'array',
      itemType: 'object',
      itemSchema: {
        src: {
          label: '图片 URL',
          type: 'string',
          placeholder: '输入图片链接'
        },
        alt: {
          label: '图片描述',
          type: 'string',
          placeholder: '输入图片描述'
        },
        title: {
          label: '标题',
          type: 'string',
          placeholder: '输入标题'
        },
        description: {
          label: '描述',
          type: 'string',
          placeholder: '输入描述'
        }
      },
      required: true
    },
    autoplay: {
      label: '自动播放',
      type: 'boolean',
      default: true
    },
    interval: {
      label: '播放间隔（毫秒）',
      type: 'number',
      min: 1000,
      max: 10000,
      default: 3000
    },
    showIndicators: {
      label: '显示指示器',
      type: 'boolean',
      default: true
    },
    showArrows: {
      label: '显示箭头',
      type: 'boolean',
      default: true
    },
    height: {
      label: '轮播图高度',
      type: 'string',
      placeholder: '例如: 400px 或 50vh',
      default: '400px'
    },
    transition: {
      label: '过渡效果',
      type: 'select',
      options: [
        { value: 'fade', label: '淡入淡出' },
        { value: 'slide', label: '滑动' },
        { value: 'zoom', label: '缩放' }
      ],
      default: 'fade'
    },
    pauseOnHover: {
      label: '鼠标悬停暂停',
      type: 'boolean',
      default: true
    }
  },
  preview: 'https://picsum.photos/800/400',
  tags: ['轮播', '图片', '自动播放', '首页']
}