import { Suspense, type ComponentType, type ReactNode } from 'react'
import Loading from '@/components/Loading'

const EmptyComponent = () => null

type LazyImportProps<P extends object = Global.AnyObj> = {
  lazy?: ComponentType<P>
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
  const Component = lazy || EmptyComponent

  return (
    <Suspense fallback={fallback}>
      <Component {...(componentProps as P)} />
    </Suspense>
  )
}

export default LazyImport
