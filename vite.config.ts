// frontend/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(async () => {
  const { default: tailwindcss } = await import('@tailwindcss/vite')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(projectDir, './src'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': { target: 'http://localhost:5001', changeOrigin: true }
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts', 'src/test/setup.ts'],
      restoreMocks: true,
      poolOptions: {
        threads: {
          maxThreads: 2,
          minThreads: 1
        }
      }
    }
  }
})
