import { isPackageExists } from 'local-pkg'
import { execSync } from 'node:child_process'
import fs from 'fs'

import {
  needInstallDeps,
  getTwConfPath,
  cssIns,
  postcssConfig,
} from './template.js'
import {
  log,
  ROOT_DIR,
  formatPath,
  isFileExists,
  readExecutableFile,
} from '../../../utils.js'

import { importCssToMain, cssInstPath } from '../utils.js'

import path from 'node:path'

const payload = JSON.parse(process.env.INIT_PAYLOAD)
const { templateDir, dependent, version } = payload

export default async function main() {
  log.success(`开始执行 ${dependent}[${version}]`)
  log.info(`当前模板目录: ${formatPath(templateDir)}`)

  const twConfPath = getTwConfPath(ROOT_DIR)

  install()
  initTwConf({ twConfPath })
  await modifyTwConfig({ twConfPath })
  modifyPostcssConfig()
  addTailwindCss()
  importCssToMain()

  execSync('pnpm lint:fix', { stdio: 'inherit' })
}
main()

/**
 * 下载相关依赖
 */
function install() {
  log.title(`🚀 开始下载相关依赖`)
  needInstallDeps.forEach((v) => {
    if (isPackageExists(v.name)) {
      log.success(`${v.name} 已安装`)
    } else {
      log.info(`[➤] ${v.name} 未安装，尝试安装...`)
      execSync(v.command(v.name, version), { stdio: 'inherit' })
    }
  })
}

/**
 * 初始化 tailwind.config.js 文件
 * @param {string} twConfPath
 * @returns
 */
function initTwConf({ twConfPath }) {
  log.title(`🚀 初始化 tailwind.config.js 文件`)
  if (isFileExists(twConfPath)) {
    log.success(`tailwind.config.js 已存在`)
  } else {
    log.info(`[➤] tailwind.config.js 不存在，尝试创建...`)
    execSync(`npx ${dependent} init`, { stdio: 'inherit' })
    log.success(`tailwind.config.js 创建成功`)
  }
}

/**
 * 修改 tailwind.config.js 文件
 * @param {string} twConfPath
 * @returns
 */
async function modifyTwConfig({ twConfPath }) {
  try {
    const mod = await readExecutableFile(twConfPath)
    if (!mod) {
      // 假设 initTwConf 已定义
      initTwConf({ twConfPath })
      return
    }
    log.title(`🚀 修改 tailwind.config.js 文件`)

    // 获取配置对象
    const config = mod.default
    const content = config?.content ?? []
    const contentPath = './src/**/*.{ts,tsx}'

    if (content.length > 0) {
      if (!content.includes(contentPath)) {
        content.push(contentPath)
      }
    } else {
      content.push(contentPath)
    }
    config.content = content
    const configTemplate = `/** @type {import('tailwindcss').Config} */
       export default ${JSON.stringify(config, null, 2)};
    `
    // 写入文件
    fs.writeFileSync(twConfPath, configTemplate, 'utf-8')
    log.success(`tailwind.config.js 修改成功`)
  } catch (error) {
    console.error('tailwind.config.js 修改失败', error)
  }
}

/**
 * 修改 postcss.config.js 文件
 * @param {string} twConfPath
 * @returns
 */
function modifyPostcssConfig() {
  try {
    const filePath = path.join(ROOT_DIR, 'postcss.config.js')
    if (isFileExists(filePath)) {
      return
    }
    log.title(`🚀 新增 postcss.config.js 文件`)
    fs.writeFileSync(filePath, postcssConfig, 'utf-8')
    log.success(`postcss.config.js 修改成功`)
  } catch (error) {
    console.error('postcss.config.js 修改失败', error)
  }
}

function addTailwindCss() {
  const cssFullInstPath = path.join(ROOT_DIR, cssInstPath)
  try {
    if (isFileExists(cssFullInstPath)) {
      const oldContent = fs.readFileSync(cssFullInstPath, 'utf-8')
      if (!oldContent.includes(cssIns)) {
        fs.writeFileSync(cssFullInstPath, `${cssIns}\n${oldContent}`, 'utf-8')
        log.success(`添加成功tailwindcss css相关成功: ${cssFullInstPath}`)
      }
      return
    }
    const dir = path.dirname(cssFullInstPath)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(cssFullInstPath, cssIns, 'utf-8')
    log.info(`新增文件: ${formatPath(cssFullInstPath)}`)
  } catch (error) {
    log.error(`添加指令在 ${cssFullInstPath} 失败`, error)
  }
}
