import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { css } from '@emotion/css'
import { useMount } from 'ahooks'
import { Input, Button, Form, message } from 'antd'
import { useState } from 'react'
import { md5 } from '@kazura/web-crypto'
import { services } from '@box-project/sdk-services'
import { useStore } from '@kazura/react-mobx'
import { useNavigate } from 'react-router-dom'
import { UserStore } from '@box-project/sdk-stores'
import { config } from '~/config'

const useCaptcha = () => {
  const renderCaptcha = () => {
    if (window.grecaptcha) {
      window.grecaptcha.render('html_element', {
        sitekey: config.GRECAPTCHA_SITEKEY,
      })
    } else {
      message.error('Captcha not loaded')
    }
  }

  useMount(() => {
    window.grecaptchaCallback = renderCaptcha
    const script = document.createElement('script')
    script.src =
      'https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&render=explicit'
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  })

  const getResponse = () => window.grecaptcha.getResponse()
  const reset = () => window.grecaptcha.reset()

  return { getResponse, reset }
}

export const PageLogin = () => {
  const [isDisabled, setIsDisabled] = useState(false)

  const { getResponse, reset } = useCaptcha()

  const navigate = useNavigate()

  const userStore = useStore(UserStore)

  const onFinish = async (values: { username: string; password: string }) => {
    setIsDisabled(true)

    console.log('Received values of form: ', values)
    const response = getResponse()
    console.log('response', response)
    const passwordMd5 = md5(values.password)

    if (!response) {
      reset()
      message.error('Please complete the captcha')
      setIsDisabled(false)
      return
    }

    const resp = await services.user$login$username({
      username: values.username,
      password: passwordMd5,
      response,
    })

    console.log('resp', resp)

    if (!resp.data.success) {
      reset()
      message.error(resp.data.message)
      setIsDisabled(false)
      return
    }

    const resource = resp.data.resource

    userStore.setPassport(resource.passport)
    userStore.setUser(resource.user)
    userStore.setStatements(resource.statements)

    navigate('/', { replace: true })
  }

  return (
    <div
      className={css`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      `}
    >
      <div
        className={css`
          width: 300px;
        `}
      >
        <Form onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <div id="html_element"></div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              disabled={isDisabled}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default PageLogin
