import { request } from '../helpers'

export interface IRequestResource {
  clientIdentifier?: string
}

export interface IResponseResource {
  passport: any
  user: any
  statements: any[]
}

export const passport$create = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/passport/create',
    method: 'POST',
    data,
  })
