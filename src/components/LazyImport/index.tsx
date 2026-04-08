import { Suspense, type ComponentType, type ReactNode } from 'react'

const EmptyComponent = () => null

type LazyImportProps<P extends object = Global.anyObj> = {
  lazy?: ComponentType<P>
  fallback?: ReactNode
  componentProps?: P
}

function LazyImport<P extends object>({
  lazy,
  fallback = 'loading...',
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
