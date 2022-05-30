import { styled, useRendererUiTheme } from '@edtr-io/ui'
import * as React from 'react'

function useExpandableBoxTheme() {
  return useRendererUiTheme('expandableBox', (theme) => {
    return {
      containerBorderColor: 'transparent',
      toggleBackgroundColor: theme.primary.background,
      toggleBorderColor: 'transparent',
      toggleColor: theme.primary.background,
    }
  })
}

const Container = styled.div<{ collapsed: boolean }>(({ collapsed }) => {
  return {
    borderRadius: '5px',
    boxShadow: `0 5px 5px rgba(0, 0, 0, ${collapsed ? 0 : 0.05})`,
  }
})

const Header = styled.div<{
  collapsed: boolean
  editable?: boolean
  alwaysVisible?: boolean
}>(({ collapsed, editable, alwaysVisible }) => {
  const { toggleBackgroundColor } = useExpandableBoxTheme()
  return {
    display: 'flex',
    backgroundColor:
      alwaysVisible || !collapsed ? toggleBackgroundColor : 'transparent',
    padding: '10px 15px 10px 10px',
    marginBottom: '10px',
    position: 'relative',
    textAlign: 'left',
    borderRadius: alwaysVisible && collapsed ? '5px' : undefined,
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    cursor: editable ? undefined : 'pointer',
    ' div': {
      marginBottom: 0,
    },
    '> div': {
      width: '100%',
    },
  }
})

const ToggleIcon = styled.a(() => {
  const { toggleColor } = useExpandableBoxTheme()
  return {
    display: 'block',
    cursor: 'pointer',
    marginRight: '10px',
    color: toggleColor,
    width: '0.3rem',
    '&:hover': {
      textDecoration: 'none',
    },
  }
})

const Content = styled.div<{ collapsed: boolean }>(({ collapsed }) => {
  return {
    display: collapsed ? 'none' : 'block',
    position: 'relative',
    padding: '5px 0',
  }
})

/**
 * @param props - The props
 * @public
 */
export function ExpandableBox(props: ExpandableBoxProps) {
  const { children, editable, alwaysVisible, renderTitle } = props
  const [collapsed, setCollapsed] = React.useState(!editable)

  return (
    <Container collapsed={collapsed}>
      <Header
        editable={editable}
        alwaysVisible={alwaysVisible}
        collapsed={collapsed}
      >
        <ToggleIcon
          onClick={() => {
            setCollapsed(!collapsed)
            return true
          }}
        >
          {collapsed ? '▸ ' : '▾ '}
        </ToggleIcon>
        {renderTitle(collapsed)}
      </Header>
      <Content collapsed={collapsed}>{children}</Content>
    </Container>
  )
}
/** @public */
export interface ExpandableBoxProps {
  children?: React.ReactNode
  editable?: boolean
  alwaysVisible?: boolean
  renderTitle: (collapsed: boolean) => React.ReactNode
}
