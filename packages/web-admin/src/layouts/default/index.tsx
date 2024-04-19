import React, { useMemo, useState } from 'react'
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  UploadOutlined,
  VideoCameraOutlined,
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  MobileOutlined,
  NotificationOutlined,
  PayCircleOutlined,
  PrinterOutlined,
  ReadOutlined,
  SaveOutlined,
  ScanOutlined,
  ScheduleOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  SkinOutlined,
  SmileOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Layout, Menu, theme } from 'antd'
import { css } from '@emotion/css'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const { Header, Content, Footer, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}

const items: MenuItem[] = [
  getItem('Dashboard', '/dashboard', <UserOutlined />),
  getItem('Permissions', '/permissions', <UploadOutlined />, [
    getItem('Roles', '/permissions/roles'),
    getItem('Policies', '/permissions/policies'),
  ]),
  getItem('Option 3', '3', <VideoCameraOutlined />),
  getItem('Option 4', '4', <BarChartOutlined />),
  getItem('Option 5', '5', <CloudOutlined />),
  getItem('Option 6', '6', <TeamOutlined />),
  getItem('Option 7', '7', <AppstoreOutlined />),
  getItem('Option 8', '8', <ShopOutlined />),
  getItem('Option 9', '9', <PieChartOutlined />),
  getItem('Option 10', '10', <DesktopOutlined />),
  getItem('Option 11', '11', <FileOutlined />),
  getItem('Option 12', '12', <PayCircleOutlined />),
  getItem('Option 13', '13', <MobileOutlined />),
  getItem('Option 14', '14', <NotificationOutlined />),
  getItem('Option 15', '15', <PrinterOutlined />),
  getItem('Option 16', '16', <ReadOutlined />),
  getItem('Option 17', '17', <SaveOutlined />),
  getItem('Option 18', '18', <ScanOutlined />),
  getItem('Option 19', '19', <ScheduleOutlined />),
  getItem('Option 20', '20', <ShoppingCartOutlined />),
  getItem('Option 21', '21', <ShoppingOutlined />),
  getItem('Option 22', '22', <SkinOutlined />),
  getItem('Option 23', '23', <SmileOutlined />),
]

export const LayoutDefault: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const history = useNavigate()

  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const menuDefaultSelected = useMemo(() => {
    const defaultSelectedKeys: string[] = [location.pathname]

    const defaultOpenKeys: string[] = []
    const parts = location.pathname.split('/')
    if (parts.length > 2) defaultOpenKeys.push('/' + parts[1])

    console.log('menuDefaultSelected', { defaultSelectedKeys, defaultOpenKeys })

    return {
      defaultSelectedKeys,
      defaultOpenKeys,
      selectedKeys: defaultSelectedKeys,
    }
  }, [location.pathname])

  return (
    <Layout hasSider style={{ minHeight: '100vh', minWidth: '100vw' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          className={css`
            height: 32px;
            margin: 16px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            text-align: center;
            color: #fff;
            line-height: 32px;
            font-weight: 600;
          `}
        >
          😊 {collapsed ? '' : 'Box Project'}
        </div>
        <Menu
          theme="dark"
          onSelect={({ key }) => {
            if (key.startsWith('/')) {
              console.log(key)
              history(key)
            }
          }}
          mode="inline"
          items={items}
          {...menuDefaultSelected}
        />
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            position: 'sticky',
            top: 0,
            width: '100%',
            zIndex: 999,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Copyright © 2020 - {new Date().getFullYear()} Box Project. All Rights
          Reserved.
        </Footer>
      </Layout>
    </Layout>
  )
}

export default LayoutDefault

export const LayoutReactNode = <LayoutDefault />
