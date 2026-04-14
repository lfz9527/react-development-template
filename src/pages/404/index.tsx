import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router'
import styles from './index.module.css'

export default function NotFound() {
  const navigate = useNavigate()
  const location = useLocation()

  const leftEyeRef = useRef<HTMLDivElement>(null)
  const rightEyeRef = useRef<HTMLDivElement>(null)

  /* Eye tracking — follows cursor */
  useEffect(() => {
    const move = (e: MouseEvent) => {
      ;[leftEyeRef, rightEyeRef].forEach((ref) => {
        const el = ref.current
        if (!el) return
        const { left, top, width, height } = el.getBoundingClientRect()
        const cx = left + width / 2
        const cy = top + height / 2
        const angle = Math.atan2(e.clientY - cy, e.clientX - cx)
        const dist = Math.min(
          4,
          Math.hypot(e.clientX - cx, e.clientY - cy) / 12
        )
        el.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`
      })
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div className={styles.container}>
      {/* ── Illustration ── */}
      <div
        className={styles.artWrap}
        aria-hidden='true'
      >
        <div className={styles.numRow}>
          <span className={styles.digit}>4</span>

          {/* CRT screen acting as the "0" */}
          <div className={styles.screen}>
            <div className={styles.scanline} />
            <div className={styles.eyeRow}>
              <div
                ref={leftEyeRef}
                className={styles.eye}
              />
              <div
                ref={rightEyeRef}
                className={styles.eye}
              />
            </div>
            <div className={styles.mouth} />
          </div>

          <span className={styles.digit}>4</span>
        </div>
      </div>

      {/* ── Path badge ── */}
      <div className={styles.badge}>
        <span className={styles.badgeDot} />
        {location.pathname}
      </div>

      {/* ── Copy ── */}
      <h1 className={styles.headline}>页面走丢了</h1>
      <p className={styles.sub}>
        你访问的路由不存在，可能已被删除、移动或链接输入有误。
      </p>

      {/* ── Actions ── */}
      <div className={styles.btnGroup}>
        <button
          className={styles.btnPrimary}
          onClick={() => navigate('/')}
        >
          返回首页
        </button>
        <button
          className={styles.btnGhost}
          onClick={() => navigate(-1)}
        >
          上一页
        </button>
      </div>
    </div>
  )
}
