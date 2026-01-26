// 产品列表 API（GET /api/products）

export default defineEventHandler(async (event) => {
  // 获取查询参数
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const pageSize = parseInt(query.pageSize as string) || 10
  const category = (query.category as string) || ""
  const search = (query.search as string) || ""

  // Mock 数据
  const products = [
    {
      id: 1,
      name: "商务名片",
      description: "高品质商务名片印刷，双面彩色印刷",
      price: 88,
      originalPrice: 110,
      category: "商务印刷",
      images: ["/images/business-card-1.jpg"],
      features: ["双面印刷", "铜版纸", "圆角处理", "UV工艺"],
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
      description: "企业宣传画册设计印刷，全彩精装",
      price: 299,
      originalPrice: 399,
      category: "商务印刷",
      images: ["/images/catalog-1.jpg"],
      features: ["全彩印刷", "铜版纸", "锁线装订", "覆哑膜"],
      stock: 50,
      sales: 234,
      rating: 4.9,
      reviewCount: 156,
      isActive: true,
      createdAt: "2024-01-05T00:00:00Z",
      updatedAt: "2024-01-20T12:00:00Z",
    },
    {
      id: 3,
      name: "海报印刷",
      description: "高清海报印刷服务，防水防晒",
      price: 58,
      originalPrice: 78,
      category: "广告印刷",
      images: ["/images/poster-1.jpg"],
      features: ["大尺寸", "防水", "哑膜", "高精度"],
      stock: 200,
      sales: 890,
      rating: 4.7,
      reviewCount: 345,
      isActive: true,
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-25T12:00:00Z",
    },
    {
      id: 4,
      name: "包装设计",
      description: "产品包装设计印刷，环保材料",
      price: 399,
      originalPrice: 599,
      category: "包装印刷",
      images: ["/images/package-1.jpg"],
      features: ["创意设计", "环保材料", "定制尺寸", "精美工艺"],
      stock: 30,
      sales: 123,
      rating: 4.6,
      reviewCount: 89,
      isActive: true,
      createdAt: "2024-01-12T00:00:00Z",
      updatedAt: "2024-01-22T12:00:00Z",
    },
    {
      id: 5,
      name: "书籍装订",
      description: "专业书籍装订服务，多种装订方式",
      price: 199,
      originalPrice: 259,
      category: "出版印刷",
      images: ["/images/book-1.jpg"],
      features: ["精装", "胶装", "骑马钉", "锁线"],
      stock: 80,
      sales: 456,
      rating: 4.9,
      reviewCount: 267,
      isActive: true,
      createdAt: "2024-01-08T00:00:00Z",
      updatedAt: "2024-01-18T12:00:00Z",
    },
    {
      id: 6,
      name: "手提袋定制",
      description: "企业手提袋定制，环保材料",
      price: 128,
      originalPrice: 168,
      category: "包装印刷",
      images: ["/images/bag-1.jpg"],
      features: ["环保材料", "精美印刷", "牢固耐用", "定制尺寸"],
      stock: 150,
      sales: 678,
      rating: 4.8,
      reviewCount: 345,
      isActive: true,
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-01-25T12:00:00Z",
    },
  ]

  // 过滤数据
  let filteredProducts = products

  if (category) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    )
  }

  if (search) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    )
  }

  // 分页
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  // 模拟延迟
  await new Promise((resolve) => setTimeout(resolve, 200))

  // 返回响应
  return {
    code: 200,
    message: "success",
    data: {
      list: paginatedProducts,
      pagination: {
        page,
        pageSize,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / pageSize),
      },
    },
  }
})
