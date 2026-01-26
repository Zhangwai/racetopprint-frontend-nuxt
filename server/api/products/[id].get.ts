// 产品详情 API（GET /api/products/:id）

export default defineEventHandler(async (event) => {
  // 获取路由参数
  const { id } = event.context.params
  const productId = parseInt(id as string)

  // Mock 数据
  const products = [
    {
      id: 1,
      name: "商务名片",
      description:
        "高品质商务名片印刷，双面彩色印刷，采用进口铜版纸，支持多种工艺选择。",
      price: 88,
      originalPrice: 110,
      category: "商务印刷",
      images: [
        "/images/business-card-1.jpg",
        "/images/business-card-2.jpg",
        "/images/business-card-3.jpg",
      ],
      features: ["双面印刷", "铜版纸", "圆角处理", "UV工艺", "烫金烫银"],
      specifications: {
        size: "90mm × 54mm",
        paper: "300g 铜版纸",
        printing: "双面四色",
        coating: "哑膜/光膜",
        process: "UV/烫金/击凸",
      },
      stock: 100,
      sales: 500,
      rating: 4.8,
      reviewCount: 234,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T12:00:00Z",
    },
    {
      id: 2,
      name: "宣传画册",
      description:
        "企业宣传画册设计印刷，全彩精装，专业设计团队为您打造专属画册。",
      price: 299,
      originalPrice: 399,
      category: "商务印刷",
      images: [
        "/images/catalog-1.jpg",
        "/images/catalog-2.jpg",
        "/images/catalog-3.jpg",
      ],
      features: ["全彩印刷", "铜版纸", "锁线装订", "覆哑膜", "烫金工艺"],
      specifications: {
        size: "210mm × 285mm",
        paper: "157g 铜版纸",
        pages: "20-200页",
        binding: "锁线精装",
        coating: "覆哑膜",
      },
      stock: 50,
      sales: 234,
      rating: 4.9,
      reviewCount: 156,
      isActive: true,
      createdAt: "2024-01-05T00:00:00Z",
      updatedAt: "2024-01-20T12:00:00Z",
    },
  ]

  // 查找产品
  const product = products.find((p) => p.id === productId)

  if (!product) {
    // 返回 404 错误
    throw createError({
      statusCode: 404,
      statusMessage: "Product not found",
      message: "产品不存在",
    })
  }

  // 模拟相关产品
  const relatedProducts = products.filter(
    (p) => p.id !== productId && p.category === product.category
  )

  // 模拟评价
  const reviews = [
    {
      id: 1,
      userId: 1,
      username: "张三",
      avatar: "/avatars/user1.jpg",
      rating: 5,
      comment: "质量非常好，印刷清晰，服务周到！",
      images: [],
      isAnonymous: false,
      createdAt: "2024-01-10T10:30:00Z",
    },
    {
      id: 2,
      userId: 2,
      username: "李四",
      avatar: "/avatars/user2.jpg",
      rating: 4,
      comment: "印刷效果不错，就是发货有点慢。",
      images: [],
      isAnonymous: false,
      createdAt: "2024-01-12T14:20:00Z",
    },
  ]

  // 模拟延迟
  await new Promise((resolve) => setTimeout(resolve, 150))

  // 返回响应
  return {
    code: 200,
    message: "success",
    data: {
      product,
      relatedProducts,
      reviews,
    },
  }
})
