import { useRoutes } from 'react-router-dom'

import { Loading, withFetchLoading } from '~/components/loading'
import { services } from '@box-project/sdk-services'
import type { HttpResponse, ResponsePacket } from '@box-project/sdk-utils'
import type { IResponseResource } from '@box-project/sdk-services/types/services/passport$create'
import { useMount } from 'ahooks'
import routes from '~/components/root/routes'
import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@box-project/sdk-stores'

interface RootRouteProps {
  result: HttpResponse<ResponsePacket<IResponseResource>>[]
}

const Component: React.FC<RootRouteProps> = ({ result }) => {
  const userStore = useStore(UserStore)
  console.log('RootRoute->userStore->user', userStore.user)
  console.log('RootRoute->userStore->passport', userStore.passport)

  useMount(() => {
    console.log('RootRoute->withFetchLoading', result)
    const resource = result[0].data.resource
    userStore.setPassport(resource.passport)
    userStore.setUser(resource.user)
    userStore.setStatements(resource.statements)

    window.localStorage.setItem('__PASSPORT', resource.passport.token)
  })

  const element = useRoutes(routes)

  if (!userStore.passport) return <Loading />

  return element
}

export const RootRoute = withFetchLoading(Component, () => [
  services.passport$create({}),
])
