import { http } from './request'

type PingParams = {
  pong: boolean
  time: string
}
export function Ping() {
  return http.request<PingParams>('/api/ping', {
    method: 'POST',
  })
}
export function GetUser(params: { id: number }) {
  return http.request('/api/user', { params })
}
