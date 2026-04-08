import { Project } from 'ts-morph'
import path from 'path'

import { log, ROOT_DIR, ensureImport } from '../../utils.js'

export const cssInstPath = 'src/styles/tailwind.css'

export function importCssToMain() {
  log.title('main.ts 文件引入')
  const mainFilePath = path.join(ROOT_DIR, 'src/main.tsx')
  const spec = `${cssInstPath.replace('src', '@')}`
  const project = new Project()
  const sourceMain = project.addSourceFileAtPath(mainFilePath)
  ensureImport(sourceMain, {
    spec,
  })
  sourceMain.saveSync()
  log.success('main.ts 文件引入成功')
}
