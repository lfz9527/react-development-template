import path from 'path'

export const cssIns = `@tailwind base;
@tailwind components;
@tailwind utilities;
`
export const cssInstPath = 'src/styles/tailwind.css'

export const postcssConfig = `
export default {
 plugins: {
   tailwindcss: {},
   autoprefixer: {},
 },
}
`

/**
 * 获取 tailwind.config.js 路径
 * @param {string} rootDir 根目录
 * @returns {string} tailwind.config.js 路径
 */
export const getTwConfPath = (rootDir) => {
  return path.join(rootDir, 'tailwind.config.js')
}

export const needInstallDeps = [
  {
    name: 'tailwindcss',
    install: false,
    command(name, version) {
      return `pnpm add -D ${name}@${version}`
    },
  },
  {
    name: 'postcss',
    install: false,
    command() {
      return `pnpm add -D postcss`
    },
  },
  {
    name: 'autoprefixer',
    install: false,
    command() {
      return `pnpm add -D autoprefixer`
    },
  },
]
