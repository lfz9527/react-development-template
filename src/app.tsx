import { useAuthor } from '@/store'
import { useState } from 'react'

import AutoTooltip from '@/components/AutoTooltip'

import {
  useIsMobile,
  useDebounceValue,
  useEventListener,
  useTimeout,
} from '@/hooks'

export default function App() {
  const isMobile = useIsMobile()
  const { token, setToken } = useAuthor()
  const [lines, setLines] = useState(1)

  const [innerWidth, setInnerWidth] = useDebounceValue(0)
  useEventListener('resize', () => {
    setInnerWidth(window.innerWidth)
  })

  useTimeout(() => {
    console.log('测试useTimeout')
  })
  const handleClick = () => {
    setToken(token + Date.now().toString())
  }

  return (
    <>
      {isMobile ? '移动端' : '非移动端'}
      <p>window.innerWidth:{innerWidth}</p>
      <div>
        <div
          style={{
            display: 'flex',
            gap: 10,
            flexShrink: 0,
          }}
        >
          <button onClick={handleClick}>Click me</button>
          <button onClick={() => setLines(lines + 1)}>add Lines</button>
        </div>
      </div>
      <AutoTooltip
        text={token}
        lines={lines}
      />
    </>
  )
}
