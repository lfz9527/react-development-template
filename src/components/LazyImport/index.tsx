import {
  Suspense,
  useMemo,
  lazy as reactLazy,
  type ComponentType,
  type ReactNode,
} from 'react'
import Loading from '@/components/Loading'

type LazyFactory = () => Promise<{ default: React.ComponentType<any> }>
const EmptyComponent = () => null

type LazyImportProps<P extends object = Global.AnyObj> = {
  lazy?: ComponentType<P> | LazyFactory
  fallback?: ReactNode
  componentProps?: P
}

function LazyImport<P extends Global.AnyObj>({
  lazy,
  fallback = (
    <Loading
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  ),
  componentProps,
}: LazyImportProps<P>) {
  const Component = useMemo(() => {
    if (!lazy) return EmptyComponent

    if (typeof lazy === 'function' && !('prototype' in lazy)) {
      return reactLazy(lazy as LazyFactory)
    }
    return lazy as React.ComponentType<P>
  }, [lazy])

  return (
    <Suspense fallback={fallback}>
      <Component {...(componentProps as P)} />
    </Suspense>
  )
}

export default LazyImport
