import { HttpRequestConfig } from '@box-project/sdk-utils'
import { request } from './helpers'

import { oauth2$google$authorize } from './services/oauth2$google$authorize'
import { oauth2$google$redirect } from './services/oauth2$google$redirect'
import { passport$create } from './services/passport$create'
import { permission$policy$create } from './services/permission$policy$create'
import { permission$policy$delete } from './services/permission$policy$delete'
import { permission$policy$list } from './services/permission$policy$list'
import { permission$policy$update } from './services/permission$policy$update'
import { permission$role$create } from './services/permission$role$create'
import { permission$role$delete } from './services/permission$role$delete'
import { permission$role$list } from './services/permission$role$list'
import { permission$role$update } from './services/permission$role$update'
import { user$login$username } from './services/user$login$username'

export const services = {
  use: (config?: HttpRequestConfig) => {
    request.instance = request.create(config)
  },
  oauth2$google$authorize,
  oauth2$google$redirect,
  passport$create,
  permission$policy$create,
  permission$policy$delete,
  permission$policy$list,
  permission$policy$update,
  permission$role$create,
  permission$role$delete,
  permission$role$list,
  permission$role$update,
  user$login$username,
}
