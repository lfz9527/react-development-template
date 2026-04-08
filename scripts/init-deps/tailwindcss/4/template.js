export const cssIns = `@import "tailwindcss";`

export const postcssConfig = `
export default {
 plugins: {
   tailwindcss: {},
   autoprefixer: {},
 },
}
`
export const viteConfigPath = 'vite.config/plugin.ts'

export const needInstallDeps = [
  {
    name: 'tailwindcss',
    install: false,
    command(name) {
      return `pnpm add ${name}`
    },
  },
  {
    name: '@tailwindcss/vite',
    install: false,
    command() {
      return `pnpm add @tailwindcss/vite`
    },
  },
]
