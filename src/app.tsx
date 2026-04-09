import { useAuthor } from '@/store'
import { useState } from 'react'

import { useIsMobile } from '@/hooks'

export default function App() {
  const isMobile = useIsMobile()
  const { token, setToken } = useAuthor()
  const [lines, setLines] = useState(1)

  const handleClick = () => {
    setToken(token + Date.now().toString())
  }
  return (
    <>
      {isMobile ? '移动端' : '非移动端'}
      <div>
        <div
          style={{
            display: 'flex',
            gap: 10,
            flexShrink: 0,
          }}
        >
          <button onClick={handleClick}>Click me</button>
          <button onClick={() => setToken('')}>Clear</button>
          <button onClick={() => setLines(lines + 1)}>add Lines</button>
        </div>
      </div>
    </>
  )
}
