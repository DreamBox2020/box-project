import { configure } from 'mobx'
import { createStores } from '@kazura/react-mobx'
import { UserStore } from './user-store'

configure({ enforceActions: 'observed' })

export const stores = createStores([UserStore])

export * from './user-store'
