import { spawn } from 'child_process'
import path from 'path'

import {
  log,
  isDirExists,
  getDepTemplatePath,
  getAllSupportedDeps,
  formatPath,
  ROOT_DIR,
} from '../utils.js'

const supportedDeps = getAllSupportedDeps()

function validateDepVersion(dependentName, version) {
  const depPath = getDepTemplatePath(dependentName)
  const depVersionPath = getDepTemplatePath(`${dependentName}/${version}`)

  if (!isDirExists(depPath)) {
    log.error(`不支持 ${dependentName} 初始化`)
    log.info(`仅支持初始化: ${supportedDeps.join(', ')}`)
    process.exit(1)
  }

  const supportedVersions = getAllSupportedDeps(depPath)

  if (!isDirExists(depVersionPath)) {
    log.error(`不支持${dependentName}版本: ${version}`)
    log.info(`仅支持 ${dependentName} 的版本: ${supportedVersions.join(', ')}`)
    process.exit(1)
  }

  return {
    templateDir: depVersionPath,
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
  const { templateDir } = validateDepVersion(dependent, version)

  log.title(`🚀 初始化: ${dependent} [${version}]`)
  log.info(`模板目录: ${formatPath(templateDir)}`)
  console.log()

  const scriptPath = path.join(templateDir, 'index.js')

  await runScript(scriptPath, {
    templateDir,
    dependent,
    version,
  })
}
main()

async function runScript(scriptPath, envVars) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath, // 当前 node 路径
      [scriptPath],
      {
        cwd: ROOT_DIR, // ← 关键：工作目录设为主项目根
        stdio: 'inherit', // 共享 stdin/stdout/stderr
        env: {
          ...process.env,
          INIT_PAYLOAD: JSON.stringify(envVars), // 参数通过环境变量传递
        },
      }
    )

    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`子进程退出码: ${code}`))
    })

    child.on('error', reject)
  })
}
