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
    command(name: string, _version: string) {
      return `pnpm add ${name}`
    },
  },
  {
    name: '@tailwindcss/vite',
    install: false,
    command(_name: string, _version: string) {
      return 'pnpm add @tailwindcss/vite'
    },
  },
]
