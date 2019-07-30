import { faCog, Icon, styled } from '@edtr-io/editor-ui'
import { ThemeProps } from '@edtr-io/ui'
import * as React from 'react'

import { createRowPluginTheme } from '../..'
import { SettingsProps } from '.'

const StyledSettings = styled.div<
  ThemeProps & { expanded: boolean; name: string }
>(({ expanded, name, ...props }) => {
  const theme = createRowPluginTheme(name, props.theme)
  return {
    position: 'absolute',
    top: 0,
    left: '-10px',
    transformOrigin: 'center top',
    transform: 'translateX(-100%)',
    pointerEvents: expanded ? 'all' : 'none',
    '&::before': {
      position: 'absolute',
      pointerEvents: 'none',
      top: 0,
      right: 0,
      content: '""',
      opacity: 1,
      height: '100%',
      width: '2px',
      backgroundColor: theme.backgroundColor,
      zIndex: 15
    }
  }
})

const StyledIconContainer = styled.div(
  ({ name, ...props }: ThemeProps & { name: string }) => {
    const theme = createRowPluginTheme(name, props.theme)
    return {
      height: '24px',
      opacity: 0.8,
      cursor: 'pointer',
      color: theme.menu.primary.color,

      '&:hover': {
        color: theme.menu.highlightColor
      }
    }
  }
)

const Content = styled.div<ThemeProps & { expanded: boolean; name: string }>(
  ({ expanded, name, ...props }) => {
    const theme = createRowPluginTheme(name, props.theme)
    return {
      backgroundColor: theme.backgroundColor,
      paddingBottom: '10px',

      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      opacity: expanded ? 1 : 0,
      zIndex: 16,
      position: 'relative',
      transition: '250ms all ease-in-out'
    }
  }
)

const SettingsIcon = (props: { open: () => void; name: string }) => (
  <span onClick={props.open}>
    <StyledIconContainer name={props.name}>
      <Icon icon={faCog} size="lg" />
    </StyledIconContainer>
  </span>
)

export const Settings: React.FunctionComponent<SettingsProps> = ({
  name,
  children,
  expanded,
  setShowExtendedSettings
}) => {
  return (
    <StyledSettings expanded={expanded} name={name} className="row-controls">
      <Content expanded={expanded} name={name}>
        {children}
        <SettingsIcon open={() => setShowExtendedSettings(true)} name={name} />
      </Content>
    </StyledSettings>
  )
}
