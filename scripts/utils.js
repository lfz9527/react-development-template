import path from 'path'
import fs from 'fs'
import url from 'url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
export const ROOT_DIR = path.resolve(__dirname, '../')

// 依赖初始化脚本目录
const DEP_TEMPLATE_DIR = path.join(ROOT_DIR, '/scripts/init-deps')

/** 带颜色的控制台输出 */
export const log = {
  info: (...args) => console.log(`\x1b[36mℹ\x1b[0m `, ...args),
  success: (...args) => console.log(`\x1b[32m✔\x1b[0m `, ...args),
  warn: (...args) => console.log(`\x1b[33m⚠\x1b[0m `, ...args),
  error: (...args) => console.error(`\x1b[31m✖\x1b[0m `, ...args),
  title: (msg) => console.log(`\n\x1b[1m\x1b[35m${msg}\x1b[0m\n`),
}

/**
 * 判断文件夹是否存在
 * @param {string} dirPath
 * @returns
 */
export function isDirExists(dirPath) {
  try {
    const stat = fs.statSync(dirPath)
    return stat.isDirectory() // 存在且是文件夹返回 true
  } catch {
    return false // 路径不存在时会抛出异常，捕获后返回 false
  }
}

/**
 * 判断文件是否存在
 * @param {string} filePath
 * @returns
 */
export function isFileExists(filePath) {
  try {
    const stat = fs.statSync(filePath)
    return stat.isFile() // 确保它是文件而不是文件夹
  } catch {
    return false // 路径不存在时会抛出异常，捕获后返回 false
  }
}

/**
 * 获取依赖模板目录
 * @param {string} path
 */
export const getDepTemplatePath = (depPath) => {
  return path.join(DEP_TEMPLATE_DIR, depPath)
}

/**
 * 获取所有支持的依赖
 * @returns {string[]}
 */
export const getAllSupportedDeps = (paths = DEP_TEMPLATE_DIR) => {
  try {
    const items = fs.readdirSync(paths, { withFileTypes: true })
    return items
      .filter((item) => item.isDirectory()) // 过滤出文件夹
      .map((item) => item.name) // 提取文件夹名称
  } catch (error) {
    console.error('读取目录失败:', error.message)
    return []
  }
}

/**
 *  格式化路径，主要用户可读性
 * @param {string} tPath
 * @returns
 */
export const formatPath = (tPath) => {
  const t = path.relative(ROOT_DIR, tPath)
  return t.replace(/\\/g, '/')
}

/**
 * 读取可执行文件
 * @param {*} filePath
 */
export const readExecutableFile = async (filePath) => {
  if (!isFileExists(filePath)) {
    return null
  }
  return await import(url.pathToFileURL(filePath).href)
}

/**
 * 移除代码中的注释（支持单行、多行，且保护字符串内的假注释）
 * @param {string} code 源代码文本
 * @returns {string} 移除注释后的代码
 */
export function removeComments(code) {
  // 正则解析：
  // Group 1 (捕获组1): 匹配所有的字符串 (双引号、单引号、反引号)
  // Group 2 (捕获组2): 匹配多行注释 /* ... */ 和 单行注释 // ...
  const regex =
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\/\*[\s\S]*?\*\/|\/\/[^\n\r]*)/g

  return code.replace(regex, (match, group1, group2) => {
    if (group1) {
      // 如果匹配到的是字符串，原样返回（保护起来）
      return group1
    }
    if (group2) {
      // 如果匹配到的是注释，返回空字符串（将其移除）
      return ''
    }
    return match
  })
}

/**
 * 确保导入
 * @param {*} sourceFile
 */
export function ensureImport(sourceFile, { spec, defaultImport }) {
  const exists = sourceFile
    .getImportDeclarations()
    .some((imp) => imp.getModuleSpecifierValue() === spec)
  if (!exists) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: spec,
      defaultImport,
    })
  }
}
