import { defineConfig } from 'vite'
import { buildPlugins } from './vite/plugin'
import { loadEnv } from 'vite'
import buildConfig from './vite/config'

export default defineConfig((conf) => {
  const { mode, command } = conf
  const env = loadEnv(mode, process.cwd())
  const isBuild = command === 'build'
  return {
    ...buildConfig({ ...conf, isBuild, env }),
    plugins: buildPlugins({ mode, isBuild, env }),

  }
})
