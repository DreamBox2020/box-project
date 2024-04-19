import { HashRouter } from 'react-router-dom'
import { RootRoute } from './root-router'
import { ConfigProvider } from 'antd-mobile'
import zhTW from 'antd-mobile/es/locales/zh-TW'

import { MobxProvider } from '@kazura/react-mobx'
import { stores } from '@box-project/sdk-stores'

export const Root = () => {
  return (
    <MobxProvider stores={stores}>
      <ConfigProvider locale={zhTW}>
        <HashRouter>
          <RootRoute />
        </HashRouter>
      </ConfigProvider>
    </MobxProvider>
  )
}
