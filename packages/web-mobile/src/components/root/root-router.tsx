import { Routes, Route, Navigate } from 'react-router-dom'
import Loading, { withFetchLoading } from '../loading-hoc'
import { services } from '@box-project/sdk-services'
import type { HttpResponse, ResponsePacket } from '@box-project/sdk-utils'
import type { IResponseResource } from '@box-project/sdk-services/types/services/passport$create'
import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@box-project/sdk-stores'
import { useMount } from 'ahooks'

import LayoutDefault from '~/layouts/default'
import { Page1 } from '~/pages/page1'
import { Page2 } from '~/pages/page2'
import { PageLogin } from '~/pages/login'
import { PageMy } from '~/pages/my'

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

  if (!userStore.passport) return <Loading />

  return (
    <Routes>
      <Route path="/login" element={<PageLogin />}></Route>
      <Route path="/index1" element={<LayoutDefault />}>
        <Route path="" element={<Page1 />}></Route>
      </Route>
      <Route path="/index2" element={<LayoutDefault />}>
        <Route path="" element={<Page2 />}></Route>
      </Route>
      <Route path="/my" element={<LayoutDefault />}>
        <Route path="" element={<PageMy />}></Route>
      </Route>
      <Route path="*" element={<Navigate to="/index1" replace />}></Route>
    </Routes>
  )
}

export const RootRoute = withFetchLoading(Component, () => [
  services.passport$create({}),
])
