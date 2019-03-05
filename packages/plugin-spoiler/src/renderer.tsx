import { StatefulPluginEditorProps } from '@edtr-io/core'
import { Icon, faCaretSquareDown, faCaretSquareUp, styled } from '@edtr-io/ui'
import * as React from 'react'

import { spoilerState } from '.'

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
export function SpoilerRenderer(props: SpoilerRendererProps) {
  const { state, title, shown } = props
  const [hidden, setHidden] = React.useState(true)
  const icon = hidden ? faCaretSquareDown : faCaretSquareUp

  return (
    <SpoilerContainer>
      <Toggle onClick={() => setHidden(!hidden)}>
        <Icon icon={icon} />
        {title ? title : state.title.value}
      </Toggle>

      <ContentContainer hidden={hidden && !shown}>
        {state.content.render()}
      </ContentContainer>
    </SpoilerContainer>
  )
}

export type SpoilerRendererProps = StatefulPluginEditorProps<
  typeof spoilerState
> & {
  title?: React.ReactNode
  shown?: boolean
}
