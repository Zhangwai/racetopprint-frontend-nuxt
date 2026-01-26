// 活动详情 API（GET /api/sales/:name）

export default defineEventHandler(async (event) => {
  // 获取路由参数
  const { name } = event.context.params
  const saleName = name as string

  // Mock 数据
  const sales = [
    {
      id: 1,
      slug: 'new-year-sale',
      title: '新年特惠',
      description: '新年大促销，全场印刷产品8折优惠，机不可失！\n\n活动规则：\n1. 活动时间：2024年1月1日 - 2024年1月15日\n2. 全场印刷产品8折优惠\n3. 满500元免运费\n4. 特价商品不参与活动\n\n立即下单，享受新年优惠！',
      type: '节日促销',
      startDate: '2024-01-01',
      endDate: '2024-01-15',
      discountPrice: 88,
      originalPrice: 110,
      discount: 20,
      status: 'active',
      products: [1, 2, 3],
      image: '/images/sale-new-year.jpg',
      isFeatured: true,
      createdAt: '2023-12-20T00:00:00Z',
      updatedAt: '2024-01-01T12:00:00Z'
    },
    {
      id: 2,
      slug: 'spring-sale',
      title: '春季新品',
      description: '春季新品发布，定制包装设计75折，专业设计师为您服务！\n\n活动亮点：\n- 专业设计团队一对一服务\n- 环保材料选择\n- 快速打样\n- 免费设计修改\n\n春季新品，引领潮流！',
      type: '新品上市',
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      discountPrice: 225,
      originalPrice: 300,
      discount: 25,
      status: 'upcoming',
      products: [4, 6],
      image: '/images/sale-spring.jpg',
      isFeatured: true,
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-15T12:00:00Z'
    },
    {
      id: 3,
      slug: 'anniversary-sale',
      title: '周年庆典',
      description: '公司周年庆，书籍装订买二送一，限量优惠！\n\n感谢您一直以来的支持，为回馈新老客户，特推出买二送一活动！\n\n活动时间：2023年12月1日 - 2023年12月31日\n活动范围：所有书籍装订产品\n活动规则：购买两本送一本（最低价）',
      type: '限时折扣',
      startDate: '2023-12-01',
      endDate: '2023-12-31',
      discountPrice: 200,
      originalPrice: 285,
      discount: 30,
      status: 'ended',
      products: [5],
      image: '/images/sale-anniversary.jpg',
      isFeatured: false,
      createdAt: '2023-11-20T00:00:00Z',
      updatedAt: '2023-12-01T12:00:00Z'
    }
  ]

  // 查找活动
  const sale = sales.find(s => s.slug === saleName)

  if (!sale) {
    // 返回 404 错误
    throw createError({
      statusCode: 404,
      statusMessage: 'Sale not found',
      message: '活动不存在'
    })
  }

  // 模拟活动产品
  const saleProducts = [
    {
      id: 1,
      name: '商务名片',
      price: 88,
      originalPrice: 110,
      image: '/images/business-card-1.jpg'
    },
    {
      id: 2,
      name: '宣传画册',
      price: 299,
      originalPrice: 399,
      image: '/images/catalog-1.jpg'
    }
  ]

  // 模拟相关活动
  const relatedSales = sales.filter(s => 
    s.id !== sale.id && s.status === 'active'
  )

  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 150))

  // 返回响应
  return {
    code: 200,
    message: 'success',
    data: {
      sale,
      saleProducts,
      relatedSales
    }
  }
})
