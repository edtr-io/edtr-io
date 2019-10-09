/**
 * @module @edtr-io/renderer-ui
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import {
  createRendererUiTheme,
  ExpandableBoxTheme,
  RendererThemeProps,
  styled
} from '@edtr-io/ui'
import * as React from 'react'

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
  renderTitle
}: {
  children?: React.ReactNode
  editable?: boolean
  alwaysVisible?: boolean
  renderTitle: (collapsed: boolean) => React.ReactNode
}) {
  const [collapsed, setCollapsed] = React.useState(!editable)

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
          <a>{renderTitle(collapsed)}</a>
        </React.Fragment>
      </Toggle>
      <Content collapsed={collapsed}>{children}</Content>
    </Wrapper>
  )
}
