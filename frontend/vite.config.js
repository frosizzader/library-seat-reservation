import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // 基础路径，部署到子路径时需要修改
  base: '/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    // 构建输出目录
    outDir: 'dist',
    // 静态资源内联阈值
    assetsInlineLimit: 4096,
    // 启用 sourcemap（生产环境可关闭）
    sourcemap: false
  }
})