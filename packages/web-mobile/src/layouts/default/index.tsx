import { TabBar } from 'antd-mobile'
import { Outlet, useLocation, useNavigate } from 'react-router'
import Container from '~/components/container'
import Footer from '~/components/footer'
import Main from '~/components/main'

import { SmileOutline, UserOutline } from 'antd-mobile-icons'
import { useMemo } from 'react'
import { css } from '@emotion/css'

export const LayoutDefault: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const pathname = useMemo(() => {
    console.log('location.pathname', location.pathname)

    const parts = location.pathname.split('/')
    if (parts.length > 2) {
      return '/' + parts[1]
    }

    return location.pathname
  }, [location.pathname])

  const setRouteActive = (value: string) => {
    navigate(value)
  }

  const tabs = [
    {
      key: '/index1',
      title: '页面1',
      icon: <SmileOutline />,
    },
    {
      key: '/index2',
      title: '页面2',
      icon: <SmileOutline />,
    },
    {
      key: '/my',
      title: '我的',
      icon: <UserOutline />,
    },
  ]

  return (
    <Container direction="vertical">
      <Main
        style={{
          background: 'rgb(250, 251, 252)',
        }}
      >
        <Outlet />
      </Main>

      <Footer
        height="calc(50px +  env(safe-area-inset-bottom))"
        style={{
          boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
          zIndex: 99,
        }}
      >
        <TabBar
          activeKey={pathname}
          onChange={(value) => setRouteActive(value)}
        >
          {tabs.map((item) => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar>
      </Footer>
    </Container>
  )
}

export default LayoutDefault

export const LayoutReactNode = <LayoutDefault />
