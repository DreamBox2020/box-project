import '~/styles/global'
import { services } from '@box-project/sdk-services'
import { config } from '~/config'

services.use({
  baseURL: config.BASE_API,
})
