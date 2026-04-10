type UseRequestReturn<T> = {
  data?: T
  loading: boolean
  message?: string
  code: number
}

export function useRequest<
  T = Global.AnyObj | undefined,
>(): UseRequestReturn<T> {
  return {
    data: undefined,
    loading: false,
    message: '',
    code: 0,
  }
}
