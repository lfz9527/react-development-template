import type { AppRouteObject } from './types'
import LazyImport from '@/components/LazyImport'
import BasicGuard from './guards/BasicGuard'

const routes: AppRouteObject[] = [
  {
    element: <BasicGuard />,
    children: [
      {
        path: '/',
        element: <LazyImport lazy={() => import('@/pages/home')} />,
        meta: { title: '首页' },
      },
      {
        path: '/login',
        element: <LazyImport lazy={() => import('@/pages/login')} />,
        meta: { title: '登陆' },
      },
      {
        path: '/404',
        element: <LazyImport lazy={() => import('@/pages/404')} />,
        meta: { title: '404' },
      },
      {
        path: '*',
        element: <LazyImport lazy={() => import('@/pages/404')} />,
        meta: { title: '404' },
      },
    ],
  },
]

export default routes
