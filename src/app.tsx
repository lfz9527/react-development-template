import { useAuthor } from '@/store'

export default function App() {
  const { token, setToken } = useAuthor((state) => state)

  const handleClick = () => {
    setToken(Date.now())
  }
  return (
    <>
      <button onClick={handleClick}>Click me</button>
      <p>{token}</p>
    </>
  )
}
