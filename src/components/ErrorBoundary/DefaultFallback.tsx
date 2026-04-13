import { type FallbackProps } from './types'
import styles from './DefaultFallback.module.css'

const DefaultFallback = ({ error, reset }: FallbackProps) => (
  <div className={styles['wrapper']}>
    <p style={{ fontWeight: 500, color: '#A32D2D' }}>Something went wrong</p>
    <pre style={{ fontSize: '12px', color: '#791F1F' }}>{error.message}</pre>
    <button onClick={reset}>Try again</button>
  </div>
)
export default DefaultFallback
