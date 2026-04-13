import { lazy } from 'react'

export const lazyImport = (path: string) => lazy(() => import(path))
