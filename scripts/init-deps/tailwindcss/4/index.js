import { isPackageExists } from 'local-pkg'
import fs from 'fs'
import { Project, SyntaxKind } from 'ts-morph'
import { execSync } from 'node:child_process'

import {
  log,
  ROOT_DIR,
  formatPath,
  ensureImport,
  isFileExists,
} from '../../../utils.js'

import { importCssToMain, cssInstPath } from '../utils.js'

import { needInstallDeps, cssIns, viteConfigPath } from './template.js'

import path from 'node:path'

const payload = JSON.parse(process.env.INIT_PAYLOAD)
const { templateDir, dependent, version } = payload

export default async function main() {
  log.success(`开始执行 ${dependent}[${version}]`)
  log.info(`当前模板目录: ${formatPath(templateDir)}`)

  install()
  useVitePlugin()
  addTailwindCss()
  importCssToMain()
}
main()

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

function useVitePlugin() {
  log.title(`🚀 添加 vite 插件 tailwindcss`)

  const vConfPath = path.join(ROOT_DIR, viteConfigPath)
  const project = new Project()
  const sourceVConf = project.addSourceFileAtPath(vConfPath)

  try {
    // 找到 plugins 变量
    const pluginsVar = sourceVConf
      .getDescendantsOfKind(SyntaxKind.VariableDeclaration)
      .find((v) => v.getName() === 'plugins')

    if (!pluginsVar) {
      throw new Error('没找到 plugins 变量')
    }

    // 拿到数组
    const pluginsArr = pluginsVar.getInitializerIfKindOrThrow(
      SyntaxKind.ArrayLiteralExpression
    )

    // 判断是否已有 tailwindcss()
    const hasTailwind = pluginsArr
      .getDescendantsOfKind(SyntaxKind.CallExpression)
      .some((call) => call.getExpression().getText() === 'tailwindcss')

    if (!hasTailwind) {
      pluginsArr.addElement('tailwindcss()')
    } else {
      log.info('已存在 tailwindcss()')
    }

    ensureImport(sourceVConf, {
      spec: '@tailwindcss/vite',
      defaultImport: 'tailwindcss',
    })

    sourceVConf.saveSync()
    log.success('添加 tailwindcss vite 插件成功')
  } catch (error) {
    log.error(`添加 tailwindcss 失败`, error)
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
