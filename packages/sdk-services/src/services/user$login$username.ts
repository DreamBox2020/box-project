import { request } from '../helpers'

export interface IRequestResource {
  username: string
  password: string
  response: string
}

export interface IResponseResource {
  passport: any
  user: any
  statements: any[]
}

export const user$login$username = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/login/username',
    method: 'POST',
    data,
  })
