import { styled, EdtrIcon, edtrDefaultPlugin } from '@edtr-io/ui'
import * as React from 'react'

import { RowsPluginConfig } from '../..'

const StyledPlugin = styled.div<{ config: RowsPluginConfig }>(({ config }) => {
  const { theme } = config
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: '15px',
    width: '175px',
    borderRadius: '5px',
    padding: '15px',
    cursor: 'pointer',
    transition: '250ms all ease-in-out',
    color: theme.menu.primary.color,

    '&:hover': {
      backgroundColor: theme.menu.secondary.backgroundColor,
    },
  }
})

const DefaultIcon = styled(EdtrIcon)({
  height: '100%',
  width: '100%',
})

const IconWrapper = styled.div({
  height: '50px',
})

const Title = styled.h3({
  marginTop: '15px',
  fontSize: '24px',
  marginBottom: '10px',
  fontWeight: 'bold',
  textAlign: 'center',
})

const Description = styled.p({
  margin: 0,
  textAlign: 'center',
  fontSize: '16px',
})

export const Plugin = ({
  config,
  plugin,
  pluginName,
  onClick,
}: {
  plugin: {
    name: string
    title?: string
    icon?: React.ComponentType
    description?: string
  }
  pluginName: string
  config: RowsPluginConfig
  onClick: () => void
}) => {
  return (
    <StyledPlugin config={config} onClick={onClick}>
      <IconWrapper>
        {plugin.icon ? (
          <plugin.icon />
        ) : (
          <DefaultIcon icon={edtrDefaultPlugin} />
        )}
      </IconWrapper>
      <Title>{plugin.title || pluginName}</Title>
      {plugin.description && <Description>{plugin.description}</Description>}
    </StyledPlugin>
  )
}
