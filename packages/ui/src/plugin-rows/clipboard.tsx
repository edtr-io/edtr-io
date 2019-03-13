import * as React from 'react'
import { Editor, EditorContext, getClipboard, PluginState } from '@edtr-io/core'
import { styled } from '../styled'

const Container = styled.div({
  textAlign: 'center'
})

const ButtonContainer = styled.div({
  marginTop: '10px',
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'space-evenly'
})

const Preview = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '80px',
  height: '45px',
  overflow: 'hidden',
  border: '1px solid black',
  margin: '0 5px'
})

const Button = styled.div({
  cursor: 'pointer'
})

const PreventMouseEvents = styled.div({
  pointerEvents: 'none'
})

export const Clipboard: React.FunctionComponent<{
  onClose: (pluginState: PluginState) => void
}> = props => {
  const store = React.useContext(EditorContext)
  const states = getClipboard(store.state)
  return (
    <Container>
      Clipboard
      <ButtonContainer>
        {states.length ? (
          states.map((state, index) => {
            return (
              <Button key={index} onClick={() => props.onClose(state)}>
                <Preview>
                  <PreventMouseEvents>
                    {/*FIXME: Use Renderer instead*/}
                    <Editor
                      plugins={store.state.plugins}
                      defaultPlugin={store.state.defaultPlugin}
                      initialState={state}
                    />
                  </PreventMouseEvents>
                </Preview>
                <div>{state.plugin}</div>
              </Button>
            )
          })
        ) : (
          <div>Nothing to insert</div>
        )}
      </ButtonContainer>
    </Container>
  )
}
