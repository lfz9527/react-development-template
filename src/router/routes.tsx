import type { RouteObject } from 'react-router'
import type { RouteMeta } from './types'

import NotFound from '@/pages/404'

export type AppRouteObject = RouteObject & {
  meta?: RouteMeta
  children?: AppRouteObject[]
}

const routes: AppRouteObject[] = [
  {
    path: '*',
    element: <NotFound />,
    meta: { title: '页面不存在' },
  },
]

export default routes
