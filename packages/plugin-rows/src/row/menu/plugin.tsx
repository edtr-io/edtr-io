import * as React from 'react'
import { Plugin as EditorPlugin } from '@edtr-io/core'
import { styled } from '@edtr-io/ui'

const StyledPlugin = styled.div({
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

  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  }
})

const DefaultIcon = styled.img({
  width: '30%'
})

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
  onClick
}: {
  plugin: EditorPlugin
  pluginName: string
  onClick: () => void
}) => {
  return (
    <StyledPlugin onClick={onClick}>
      {plugin.icon ? (
        <plugin.icon />
      ) : (
        <DefaultIcon src={require('../../../assets/default-plugin.svg')} />
      )}
      <Title>{plugin.title || pluginName}</Title>
      {plugin.description && <Description>{plugin.description}</Description>}
    </StyledPlugin>
  )
}
