#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = resolve(__dirname, '..')
const vitestExecutable = process.platform === 'win32' ? 'vitest.cmd' : 'vitest'
const vitestBin = resolve(projectRoot, 'node_modules', '.bin', vitestExecutable)

const args = process.argv.slice(2)
let threadsValue
const forwardedArgs = []

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index]
  if (arg.startsWith('--threads')) {
    const [, value] = arg.split('=')
    if (value) {
      threadsValue = value
    } else {
      threadsValue = args[index + 1]
      if (threadsValue?.startsWith('-')) {
        threadsValue = undefined
      } else if (threadsValue !== undefined) {
        index += 1
      }
    }
    continue
  }

  forwardedArgs.push(arg)
}

const env = { ...process.env }

if (threadsValue !== undefined) {
  const parsed = Number.parseInt(threadsValue, 10)
  if (Number.isNaN(parsed) || parsed <= 0) {
    console.warn(`Ignoring invalid --threads value: ${threadsValue}`)
  } else {
    env.VITEST_MAX_THREADS = String(parsed)
  }
}

const result = spawnSync(vitestBin, forwardedArgs, {
  cwd: projectRoot,
  stdio: 'inherit',
  env,
})

if (result.error) {
  console.error(result.error)
  process.exit(1)
}

process.exit(result.status ?? 0)
