import React, { PropsWithChildren } from 'react'
import styled from '@emotion/styled'

const StyledHeader = styled.header`
  box-sizing: border-box;
  flex-shrink: 0;
`

export interface IHeaderProps {
  height?: string
  style?: React.CSSProperties
}

export const Header: React.FC<PropsWithChildren<IHeaderProps>> = (props) => {
  const { height = '60px', children, style } = props
  return <StyledHeader style={{ height, ...style }}>{children}</StyledHeader>
}

export default Header
