import { UserStore } from '@box-project/sdk-stores'
import { css } from '@emotion/css'
import { useStore } from '@kazura/react-mobx'
import { Avatar, Button, List, NavBar } from 'antd-mobile'
import { StarOutline, SetOutline } from 'antd-mobile-icons'
import Container from '~/components/container'
import Header from '~/components/header'
import Main from '~/components/main'
import { WhiteSpace } from '~/components/white-space'
import { WingBlank } from '~/components/wing-blank'

export const PageMy = () => {
  const userStore = useStore(UserStore)
  return (
    <Container direction="vertical">
      <Header
        height="45px"
        style={{
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          zIndex: 99,
          background: '#fff',
        }}
      >
        <NavBar back={null}>我的</NavBar>
      </Header>
      <Main>
        <WhiteSpace />

        <List>
          <List.Item
            prefix={<Avatar src={userStore.user.avatar} />}
            description={userStore.user.email}
          >
            {userStore.user.nikename}
          </List.Item>
        </List>

        <WhiteSpace />

        <List
          className={css`
            .adm-list-item {
              padding-left: 0;
            }
            .adm-list-item-content {
              padding-left: var(--padding-left);
            }
          `}
        >
          <List.Item prefix={<StarOutline />} onClick={() => {}}>
            菜单1
          </List.Item>
          <List.Item prefix={<SetOutline />} onClick={() => {}}>
            菜单2
          </List.Item>
        </List>
        <WhiteSpace />

        <Button
          block
          className={css`
            &.adm-button {
              ::before {
                display: none;
              }
              border-radius: 0;
              color: #ff3141;
              border-left: none;
              border-right: none;
            }
          `}
          onClick={() => {}}
        >
          退出登录
        </Button>

        <WhiteSpace />
      </Main>
    </Container>
  )
}
