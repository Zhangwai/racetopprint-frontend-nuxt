// app/plugins/pinia-persisted.client.ts

import { createPersistedState } from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  // 只在客户端执行
  if (process.client) {
    nuxtApp.$pinia.use(
      createPersistedState({
        // 全局配置
        key: (id) => `pinia_${id}`,
        storage: {
          getItem: (key) => {
            try {
              return JSON.parse(window.localStorage.getItem(key) || 'null')
            } catch {
              return null
            }
          },
          setItem: (key, value) => {
            window.localStorage.setItem(key, JSON.stringify(value))
          },
          removeItem: (key) => {
            window.localStorage.removeItem(key)
          },
        },
      })
    )
  }
})
