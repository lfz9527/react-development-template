declare namespace Global {
  type anyObj<V = any> = Record<string, V>

  type elAttrs<T = any> = {
    className?: string
    style?: React.CSSProperties
    onClick?: React.MouseEventHandler<T>
  }
}
