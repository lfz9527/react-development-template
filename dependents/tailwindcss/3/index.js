import { execSync } from 'node:child_process'
import fs from 'fs'
import path from 'path'

let context = {}

const cssTemplate = `
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
`
const cssPath = 'styles/tailwind.css'

const postcssConfig = `
export default {
 plugins: {
   tailwindcss: {},
   autoprefixer: {},
 },
}
`

function install() {
  const { log, dependent, version } = context
  log.info('安装依赖')
  execSync(`pnpm add -D ${dependent}@${version} postcss autoprefixer`, {
    stdio: 'inherit',
  })
  execSync(`npx ${dependent} init`, { stdio: 'inherit' })
}

function modifyConfig() {
  const { log, ROOT_DIR } = context
  const tailwindConfigPath = path.join(ROOT_DIR, 'tailwind.config.js')
  log.info('修改配置文件：', tailwindConfigPath)
  const twConfig = fs.readFileSync(tailwindConfigPath, 'utf-8')
  const tailwindConfig = twConfig.replace(
    'content: []',
    `content: ['./src/**/*.{ts,tsx}']`
  )
  fs.writeFileSync(tailwindConfigPath, tailwindConfig)
}

function addTailwindCommand() {
  const { log, ROOT_DIR } = context
  log.info('添加Tailwind css指令')

  const filePath = path.join(ROOT_DIR, `src/${cssPath}`)
  const dirPath = path.dirname(filePath)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
  if (fs.existsSync(filePath)) {
    const oldContent = fs.readFileSync(filePath, 'utf-8')
    fs.writeFileSync(filePath, `${cssTemplate}\n${oldContent}`, 'utf-8')
  } else {
    fs.writeFileSync(filePath, content, 'utf-8')
  }
}

function importDep() {
  const { log, ROOT_DIR } = context
  log.info('main.ts 文件引入')

  const filePath = path.join(ROOT_DIR, 'src/main.tsx')
  const dirPath = path.dirname(filePath)
  const pathStr = `import '@/${cssPath}'`

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  if (fs.existsSync(filePath)) {
    const oldContent = fs.readFileSync(filePath, 'utf-8')
    // 判断是否已经存在
    if (oldContent.includes(pathStr)) {
      log.info('main.tsx 文件已存在')
      return
    }
    fs.writeFileSync(filePath, `${pathStr}\n${oldContent}`, 'utf-8')
  } else {
    fs.writeFileSync(filePath, pathStr, 'utf-8')
  }
}

// 构建postcss.config.js
function buildPostcssConfig() {
  const { log, ROOT_DIR } = context
  log.info('构建postcss.config.js')
  const filePath = path.join(ROOT_DIR, 'postcss.config.js')
  fs.writeFileSync(filePath, postcssConfig, 'utf-8')
}

export default async function run(ctx) {
  context = ctx
  const { log, dependent, version, templateDir } = context
  log.success(`开始执行 ${dependent}[${version}]`)
  log.info(`当前模板目录: ${templateDir}`)

  install()
  modifyConfig()
  buildPostcssConfig()
  addTailwindCommand()
  importDep()
}
