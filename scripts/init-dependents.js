import { readFileSync, existsSync } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import path from 'path'

import { log } from './utils.js'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '../')
const DEPENDENTS_DIR = path.join(ROOT_DIR, 'dependents')

const manifest = JSON.parse(
  readFileSync(path.join(DEPENDENTS_DIR, 'manifest.json'), 'utf-8')
)

// 1. 检查版本或者依赖模板是否存在
function validateDepVersion(dependentName, version) {
  // 依赖模板存在版本校验
  if (!manifest[dependentName].find((v) => v === version)) {
    log.error(`${dependentName}不支持的版本: "${version}"`)
    log.info(`支持的版本: ${manifest[dependentName].join(', ')}`)
    process.exit(1)
  }

  // 依赖模板存在校验
  if (!manifest[dependentName]) {
    log.error(`不支持依赖 ${dependentName} 初始化`)
    log.info(`支持的依赖: ${Object.keys(manifest).join(', ')}`)
    process.exit(1)
  }
}

// 解析脚本 携带参数
function parseArgs() {
  const [dependent, version] = process.argv.slice(2)
  if (!dependent || !version) {
    log.error('用法: pnpm init-dep <dependent> <version>')
    log.error('示例: pnpm init-dep tailwindcss v3')
    process.exit(1)
  }
  return { dependent, version: version.replace(/v/gi, '').trim() }
}

async function main() {
  const { dependent, version } = parseArgs()
  validateDepVersion(dependent, version)

  const templateDir = path.join(DEPENDENTS_DIR, dependent, version)

  if (!existsSync(templateDir)) {
    log.error(`模板目录不存在: dependents/${dependent}/${version}`)
    log.error('请确认 dependents 文件夹下有对应的模板')
    process.exit(1)
  }

  log.title(`🚀 初始化依赖: ${dependent} [${version}]`)
  log.info(`模板目录: ${path.relative(ROOT_DIR, templateDir)}`)
  console.log()

  const mod = await import(
    pathToFileURL(path.join(templateDir, 'index.js')).href
  )
  const run = mod.default ?? mod.run

  if (typeof run !== 'function') {
    log.error('index.js 必须导出 default 或 run 函数')
    process.exit(1)
  }

  await run({
    ROOT_DIR,
    templateDir,
    dependent,
    version,
    log,
  })
}
main()
