import { NavBar } from 'antd-mobile'
import Container from '~/components/container'
import Header from '~/components/header'
import Main from '~/components/main'
import { WhiteSpace } from '~/components/white-space'

export const Page1 = () => {
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
        <NavBar back={null}>页面1</NavBar>
      </Header>
      <Main>
        <WhiteSpace />

        <WhiteSpace />
      </Main>
    </Container>
  )
}
