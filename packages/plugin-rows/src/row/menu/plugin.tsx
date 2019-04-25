import * as React from 'react'
import { Plugin as EditorPlugin } from '@edtr-io/core'
import { styled, faToolbox, Icon } from '@edtr-io/editor-ui'
import { ThemeProps } from '@edtr-io/ui'
import { createRowPluginTheme } from '../..'

const StyledPlugin = styled.div(
  ({ name, ...props }: ThemeProps & { name: string }) => {
    const theme = createRowPluginTheme(name, props.theme)
    return {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '15px',
      width: '175px',
      borderRadius: '5px',
      padding: '15px',
      cursor: 'pointer',
      transition: '250ms all ease-in-out',
      color: theme.menu.primary.color,

      '&:hover': {
        backgroundColor: theme.menu.secondary.backgroundColor
      }
    }
  }
)

const Title = styled.h3({
  marginTop: '15px',
  fontSize: '24px',
  marginBottom: '10px',
  fontWeight: 'bold',
  textAlign: 'center'
})

const Description = styled.p({
  margin: 0,
  textAlign: 'center',
  fontSize: '16px'
})

export const Plugin = ({
  plugin,
  pluginName,
  onClick,
  name
}: {
  plugin: EditorPlugin
  pluginName: string
  onClick: () => void
  name: string
}) => {
  return (
    <StyledPlugin onClick={onClick} name={name}>
      {plugin.icon ? <plugin.icon /> : <Icon icon={faToolbox} size="5x" />}
      <Title>{plugin.title || pluginName}</Title>
      {plugin.description && <Description>{plugin.description}</Description>}
    </StyledPlugin>
  )
}
