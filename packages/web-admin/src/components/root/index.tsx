import { HashRouter } from 'react-router-dom'
import { RootRoute } from './root-router'
import { ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'

import { MobxProvider } from '@kazura/react-mobx'
import { stores } from '@box-project/sdk-stores'

export const Root = () => {
  return (
    <MobxProvider stores={stores}>
      <ConfigProvider locale={enUS}>
        <HashRouter>
          <RootRoute />
        </HashRouter>
      </ConfigProvider>
    </MobxProvider>
  )
}
