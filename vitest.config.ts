import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const projectDir = fileURLToPath(new URL('.', import.meta.url))

const parseThreadCount = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback
  }

  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback
  }

  return parsed
}

const maxThreads = parseThreadCount(process.env.VITEST_MAX_THREADS, 2)
const minThreadsCandidate = parseThreadCount(process.env.VITEST_MIN_THREADS, 1)
const minThreads = Math.min(minThreadsCandidate, maxThreads)
const minWorkers = minThreads
const maxWorkers = maxThreads

export default defineConfig(async () => {
  const { default: tailwindcss } = await import('@tailwindcss/vite')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(projectDir, './src'),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts', 'src/test/setup.ts'],
      restoreMocks: true,
      poolOptions: {
        threads: {
          minThreads,
          maxThreads,
        },
      },
      minWorkers,
      maxWorkers,
    },
  }
})
