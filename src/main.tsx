import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import ErrorBoundary from '@/components/ErrorBoundary'
import { GlobalCrash } from '@/components/ErrorBoundary/globalCrash'
import App from './app'
import '@/styles/index.css'

const root = createRoot(document.getElementById('root')!, {
  // 捕获 ErrorBoundary 内部的错误
  onCaughtError: (error) => {
    console.error('ErrorBoundary 内部的错误', error)
  },
  // 捕获未捕获的错误（全局错误）
  onUncaughtError: (error: any) => {
    console.error('React 崩溃', error)
    // React 树已崩溃
    root.render(<GlobalCrash error={error} />)
  },
  // 捕获可恢复的错误（不会崩溃）
  onRecoverableError: (error) => {
    console.warn('recoverable error', error)
  },
  // 用于生成唯一 ID 前缀
  identifierPrefix: 'xt',
})

root.render(
  <StrictMode>
    {/* 负责渲染层的错误 → 展示 fallback，用户可点击重试 */}
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <GlobalCrash
          error={error}
          reset={reset}
        />
      )}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>
)
