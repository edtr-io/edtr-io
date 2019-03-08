import * as React from 'react'
import { PluginState } from '@edtr-io/core'
import { styled } from '@edtr-io/ui'

const Container = styled.div({
  textAlign: 'center'
})

const ButtonContainer = styled.div({
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'space-around'
})

export const Clipboard: React.FunctionComponent<{
  states: PluginState[]
  onClose: (pluginState: PluginState) => void
}> = props => {
  return (
    <Container>
      Clipboard
      <ButtonContainer>
        {props.states.length ? (
          props.states.map((state, index) => {
            return (
              <button
                key={index}
                title={JSON.stringify(state.state)}
                onClick={() => props.onClose(state)}
              >
                {state.plugin}
              </button>
            )
          })
        ) : (
          <div>Nothing to insert</div>
        )}
      </ButtonContainer>
    </Container>
  )
}
