import * as React from 'react'

import {
  createRendererUiElementTheme,
  RendererThemeProps,
  styled
} from '../theme'
import { faCaretSquareDown, faCaretSquareUp, Icon } from './icon'

export const createExpandableBoxTheme = createRendererUiElementTheme<
  ExpandableBoxTheme
>(theme => {
  return {
    containerBorderColor: 'transparent',
    toggleBackgroundColor: theme.primary.background,
    toggleBorderColor: 'transparent',
    toggleColor: theme.primary.color
  }
})

const Wrapper = styled.div<{ collapsed: boolean } & RendererThemeProps>(
  ({ collapsed, theme }) => {
    const { containerBorderColor } = createExpandableBoxTheme(
      'expandableBox',
      theme
    )

    return {
      marginTop: '12px',
      marginBottom: '20px',
      border: `1px solid ${collapsed ? 'transparent' : containerBorderColor}`,
      borderRadius: '2px',
      boxShadow: `0 1px 1px rgba(0, 0, 0, ${collapsed ? 0 : 0.05})`
    }
  }
)

const Toggle = styled.div<
  { collapsed: boolean; editable?: boolean } & RendererThemeProps
>(({ collapsed, editable, theme }) => {
  const {
    toggleBackgroundColor,
    toggleBorderColor,
    toggleColor
  } = createExpandableBoxTheme('expandableBox', theme)

  return {
    backgroundColor: collapsed ? 'transparent' : toggleBackgroundColor,
    '& a': {
      color: collapsed ? undefined : toggleColor
    },
    padding: '10px 15px 10px 10px',
    position: 'relative',
    borderColor: collapsed ? 'transparent' : toggleBorderColor,
    textAlign: 'left',
    cursor: editable ? undefined : 'pointer'
  }
})

const Content = styled.div<{ collapsed: boolean }>(({ collapsed }) => {
  return {
    display: collapsed ? 'none' : 'block',
    position: 'relative'
  }
})

export function ExpandableBox({
  children,
  editable,
  title
}: {
  children?: React.ReactNode
  editable?: boolean
  title: React.ReactNode
}) {
  let [collapsed, setCollapsed] = React.useState(true)
  collapsed = !editable && collapsed

  return (
    <Wrapper collapsed={collapsed}>
      <Toggle
        editable={editable}
        collapsed={collapsed}
        onClick={() => {
          setCollapsed(!collapsed)
        }}
      >
        {editable ? null : (
          <Icon icon={collapsed ? faCaretSquareDown : faCaretSquareUp} />
        )}
        <a>{title}</a>
      </Toggle>
      <Content collapsed={collapsed}>{children}</Content>
    </Wrapper>
  )
}

export interface ExpandableBoxTheme {
  containerBorderColor: string
  toggleBorderColor: string
  toggleBackgroundColor: string
  toggleColor: string
}
