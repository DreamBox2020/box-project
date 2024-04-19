import { Request } from '@box-project/sdk-utils'

export const request = new Request({
  baseURL: '',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})
