import path from 'node:path'

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

export const getTwConfPath = (rootDir: string) => {
  return path.join(rootDir, 'tailwind.config.js')
}

export const needInstallDeps = [
  {
    name: 'tailwindcss',
    install: false,
    command(name: string, version: string) {
      return `pnpm add -D ${name}@${version}`
    },
  },
  {
    name: 'postcss',
    install: false,
    command() {
      return 'pnpm add -D postcss'
    },
  },
  {
    name: 'autoprefixer',
    install: false,
    command() {
      return 'pnpm add -D autoprefixer'
    },
  },
]
