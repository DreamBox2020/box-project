import { services } from '@box-project/sdk-services'
import { UserStore } from '@box-project/sdk-stores'
import { css } from '@emotion/css'
import { useStore } from '@kazura/react-mobx'
import { useMount } from 'ahooks'
import { Button, Toast } from 'antd-mobile'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import Loading from '~/components/loading-hoc'

export const PageLogin = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const userStore = useStore(UserStore)

  const [isVisible, setIsVisible] = useState(false)

  useMount(async () => {
    const params = new URLSearchParams(location.search)
    const state = params.get('state')
    const code = params.get('code')
    const redirectUri = params.get('redirectUri')

    console.log('PageLogin->useMount', { state, code, redirectUri })

    if (state && code && redirectUri) {
      const resp = await services.oauth2$google$authorize({
        state,
        code,
        redirectUri,
      })

      if (!resp.data.success) {
        Toast.show({
          icon: 'fail',
          content: resp.data.message,
        })
        navigate('/login', { replace: true })
        return
      }

      const resource = resp.data.resource

      userStore.setPassport(resource.passport)
      userStore.setUser(resource.user)
      userStore.setStatements(resource.statements)

      navigate('/', { replace: true })
      return
    }

    if (state !== null || code !== null || redirectUri !== null) {
      navigate('/login', { replace: true })
      return
    }

    setIsVisible(true)
  })

  const login = async () => {
    setIsVisible(false)

    try {
      const result = await services.oauth2$google$redirect({
        redirectUri: 'http://localhost:4008/oauth2.html',
      })
      console.log(result)
      window.location.href = result.data.resource.redirectUri
    } catch (error) {
      console.error(error)
      setIsVisible(true)
    }
  }

  return (
    <div className={css``}>
      <div
        className={css`
          box-sizing: border-box;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #ccc;
          height: 36px;
          padding: 0 16px;
        `}
      >
        <div
          className={css`
            height: 14px;
            margin-right: 12px;
          `}
        >
          <img
            width="14px"
            height="14px"
            src={new URL('~/assets/google.svg', import.meta.url).href}
            alt=""
            className={css`
              display: block;
              height: 14px;
              position: relative;
              top: 1px;
              width: 14px;
            `}
          />
        </div>
        <div
          className={css`
            height: 14px;
            color: rgb(95, 99, 104);
            font-size: 14px;
            margin-top: -2px;
          `}
        >
          使用 Google 账号登录
        </div>
      </div>
      <div
        className={css`
          margin: 130px auto;
          text-align: center;
        `}
      >
        <Button
          shape="rounded"
          onClick={login}
          style={{
            display: isVisible ? 'inline-block' : 'none',
          }}
        >
          <img
            width="24px"
            height="24px"
            src={new URL('~/assets/google.svg', import.meta.url).href}
            alt=""
            style={{
              verticalAlign: 'bottom',
            }}
          />
          <span> 使用 Google 账号登录</span>
        </Button>
      </div>
      {isVisible ? null : <Loading />}
    </div>
  )
}

export default PageLogin
