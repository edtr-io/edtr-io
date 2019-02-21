import styled from 'styled-components'
import * as React from 'react'
import { Document } from '@edtr-io/core'
import { SpoilerPluginState } from './editor'

const SpoilerContainer = styled.div({
  backgroundColor: '#f5f5f5',
  padding: '10px 15px 10px 40px',
  position: 'relative',
  borderColor: '#dddddd',
  textAlign: 'left',
  cursor: 'pointer',
  minHeight: '41px',

  '& .fa': {
    position: 'absolute',
    bottom: '13px',
    left: '15px'
  }
})

const Toggle = styled.div({
  backgroundColor: '#f5f5f5',
  padding: '10px 15px 10px 40px',
  position: 'relative',
  borderColor: '#dddddd',
  textAlign: 'left',
  cursor: 'pointer',
  minHeight: '41px',

  '& .fa': {
    position: 'absolute',
    bottom: '13px',
    left: '15px'
  }
})

const ContentContainer = styled.div<{ hidden?: boolean }>(({ hidden }) => {
  return {
    padding: '15px',
    display: hidden ? 'none' : 'block'
  }
})
//@ts-ignore
//TODO: Type of props
export function SpoilerRenderer(props) {
  const { state, title, shown } = props
  const [hidden, setHidden] = React.useState(true)
  const icon = hidden ? 'fa-caret-square-o-down' : 'fa-caret-square-o-up'

  return (
    <SpoilerContainer>
      <Toggle onClick={() => setHidden(!hidden)}>
        <span className={`fa ${icon}`} />
        {title ? title : state.value.title.value}
      </Toggle>

      <ContentContainer hidden={hidden && !shown}>
        <Document state={state.value.content.value} />
      </ContentContainer>
    </SpoilerContainer>
  )
}

export interface SpoilerRendererProps {
  state: SpoilerPluginState
  title?: React.ReactNode
  shown?: boolean
}

export interface SpoilerRendererState {
  hidden: boolean
}
