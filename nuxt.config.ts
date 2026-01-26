// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // SSR 配置（Nuxt 3 默认启用）
  ssr: true,

  // 应用配置
  app: {
    head: {
      title: "RaceTopprint",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "高品质印刷解决方案提供商" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  // 模块配置
  modules: [],

  // 开发服务器配置
  devServer: {
    port: 3000,
    host: "localhost",
  },

  // 环境变量
  runtimeConfig: {
    // 服务端环境变量（客户端不可访问）
    apiSecret: process.env.API_SECRET || "default_secret",

    // 客户端环境变量（客户端可访问）
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "/api",
      appName: "RaceTopprint",
    },
  },
})
