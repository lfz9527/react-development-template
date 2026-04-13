// GlobalCrash.tsx
import { useState, type ErrorInfo } from 'react'
import styles from './GlobalCrash.module.css'

interface GlobalCrashProps {
  error: Error
  errorInfo?: ErrorInfo | null
  reset?: () => void
}

const WarningIcon = () => (
  <svg
    width='22'
    height='22'
    viewBox='0 0 22 22'
    fill='none'
  >
    <path
      d='M11 3L20 19H2L11 3Z'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinejoin='round'
    />
    <line
      x1='11'
      y1='9'
      x2='11'
      y2='13.5'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
    />
    <circle
      cx='11'
      cy='16'
      r='0.8'
      fill='currentColor'
    />
  </svg>
)

export const GlobalCrash = ({ error, errorInfo, reset }: GlobalCrashProps) => {
  const [showDetail, setShowDetail] = useState(false)

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <WarningIcon />
        </div>

        <p className={styles.title}>页面发生了错误</p>
        <p className={styles.desc}>
          应用遇到了未预期的问题，请尝试刷新页面。
          如果问题持续出现，请联系技术支持。
        </p>

        <div className={styles.errorBox}>
          <p className={styles.errorLabel}>错误信息</p>
          <p className={styles.errorMessage}>{error.message}</p>
        </div>

        <div className={styles.actions}>
          <button onClick={reset ?? handleRefresh}>
            {reset ? '重试' : '刷新页面'}
          </button>
          <button onClick={() => setShowDetail((v) => !v)}>
            {showDetail ? '收起详情' : '查看详情'}
          </button>
        </div>

        {showDetail && (
          <div className={styles.stackBox}>
            <pre className={styles.stackText}>
              {error.stack}
              {errorInfo?.componentStack}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
