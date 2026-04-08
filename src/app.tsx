import { useAuthor } from '@/store'

import Loading from '~icons/local-icons/loading'

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
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <button onClick={handleClick}>Click me</button>
        <button onClick={() => setLines(lines + 1)}>add Lines</button>
      </div>
      <AutoTooltip text={token} />
    </>
  )
}
