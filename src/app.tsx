import { useAuthor } from '@/store'

import Loading from '@/components/Loading'

import AutoTooltip from '@/components/AutoTooltip'
import { useState } from 'react'

export default function App() {
  const { token, setToken } = useAuthor((state) => state)
  const [lines, setLines] = useState(1)

  const handleClick = () => {
    setToken(token + Date.now().toString())
  }
  return (
    <>
      <Loading />
      <div
        style={{
          display: 'flex',
          gap: 10,
        }}
      >
        <button onClick={handleClick}>Click me</button>
        <button onClick={() => setLines(lines + 1)}>add Lines</button>
        <AutoTooltip text={token} />
      </div>
    </>
  )
}
