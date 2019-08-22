import * as React from 'react'

import { createRendererUiTheme, RendererThemeProps, styled } from '../theme'
import { faSortDown, faSortUp, Icon } from './icon'

export const createExpandableBoxTheme = createRendererUiTheme<
  ExpandableBoxTheme
>(theme => {
  return {
    containerBorderColor: 'transparent',
    toggleBackgroundColor: theme.primary.background,
    toggleBorderColor: 'transparent',
    toggleColor: theme.primary.background
  }
})

const Wrapper = styled.div<{ collapsed: boolean }>(({ collapsed }) => {
  return {
    borderRadius: '5px',
    boxShadow: `0 5px 5px rgba(0, 0, 0, ${collapsed ? 0 : 0.05})`
  }
})

const Toggle = styled.div<
  {
    collapsed: boolean
    editable?: boolean
    alwaysVisible?: boolean
  } & RendererThemeProps
>(({ collapsed, editable, alwaysVisible, theme }) => {
  const { toggleBackgroundColor, toggleColor } = createExpandableBoxTheme(
    'expandableBox',
    theme
  )

  return {
    backgroundColor:
      alwaysVisible || !collapsed ? toggleBackgroundColor : 'transparent',
    '& a': {
      color: toggleColor
    },
    padding: '10px 15px 10px 10px',
    marginBottom: '10px',
    position: 'relative',
    textAlign: 'left',
    borderRadius: alwaysVisible && collapsed ? '5px' : undefined,
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    cursor: editable ? undefined : 'pointer'
  }
})

const Content = styled.div<{ collapsed: boolean }>(({ collapsed }) => {
  return {
    display: collapsed ? 'none' : 'block',
    position: 'relative',
    padding: '5px 0'
  }
})

const StyledIcon = styled(Icon)<{ collapsed: boolean } & RendererThemeProps>(
  ({ collapsed, theme }) => {
    const { toggleColor } = createExpandableBoxTheme('expandableBox', theme)
    return {
      marginRight: '10px',
      marginBottom: collapsed ? '3px' : '-3px',
      color: toggleColor
    }
  }
)

export function ExpandableBox({
  children,
  editable,
  alwaysVisible,
  title
}: {
  children?: React.ReactNode
  editable?: boolean
  alwaysVisible?: boolean
  title: React.ReactNode
}) {
  const [collapsed, setCollapsed] = React.useState(true)

  return (
    <Wrapper collapsed={collapsed}>
      <Toggle
        editable={editable}
        alwaysVisible={alwaysVisible}
        collapsed={collapsed}
        onClick={() => {
          setCollapsed(!collapsed)
        }}
      >
        <React.Fragment>
          <StyledIcon
            collapsed={collapsed}
            icon={collapsed ? faSortDown : faSortUp}
          />
          <a>{title}</a>
        </React.Fragment>
      </Toggle>
      <Content collapsed={collapsed}>{children}</Content>
    </Wrapper>
  )
}

export interface ExpandableBoxTheme {
  containerBorderColor: string
  toggleBackgroundColor: string
  toggleColor: string
}
