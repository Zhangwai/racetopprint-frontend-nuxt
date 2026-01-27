// server/api/pages/[slug].get.ts

import { usePageStore } from '@/stores/pageStore'
import type { PageConfig } from '~/types/component-builder'

export default defineEventHandler(async (event) => {
  const { slug } = getRouterParams(event)

  // 验证 slug
  if (!slug || typeof slug !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: '页面路径不能为空',
    })
  }

  try {
    // 获取页面 Store
    const pageStore = usePageStore()

    // 初始化页面数据（如果还没有初始化）
    if (pageStore.pages.length === 0) {
      await pageStore.initPages()
    }

    // 查找页面
    const page = pageStore.pages.find(
      (p) => p.slug === slug && p.status === 'published'
    )

    if (!page) {
      throw createError({
        statusCode: 404,
        statusMessage: `页面 "${slug}" 不存在或未发布`,
      })
    }

    // 返回页面配置
    return {
      code: 200,
      message: 'success',
      data: {
        id: page.id,
        name: page.name,
        slug: page.slug,
        title: page.title,
        description: page.description,
        keywords: page.keywords,
        components: page.components,
        status: page.status,
        publishedAt: page.publishedAt,
      } as PageConfig,
    }
  } catch (error) {
    console.error('Failed to get page:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '获取页面配置失败',
    })
  }
})
