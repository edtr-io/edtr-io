import * as React from 'react'
import {
  Editor,
  getClipboard,
  PluginState,
  getPlugins,
  Plugin
} from '@edtr-io/core'
import { styled } from '@edtr-io/ui'
import { getDefaultPlugin, State } from '@edtr-io/core/src/store'
import { connect } from 'react-redux'

const ClipboardHeader = styled.div({
  fontSize: '130%',
  textAlign: 'center',
  marginBottom: '10px'
})

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

export const Clipboard: React.FunctionComponent<
  {
    onClose: (pluginState: PluginState) => void
  } & ClipboardProps
> = props => {
  const states = props.clipboard
  return (
    <Container>
      <ClipboardHeader> Zwischenablage </ClipboardHeader>
      <ButtonContainer>
        {states.length ? (
          states.map((state, index) => {
            return (
              <Button key={index} onClick={() => props.onClose(state)}>
                <Preview>
                  <PreventMouseEvents>
                    <Editor
                      plugins={props.plugins}
                      defaultPlugin={props.defaultPlugin}
                      initialState={state}
                      editable={false}
                    />
                  </PreventMouseEvents>
                </Preview>
                <div>{state.plugin}</div>
              </Button>
            )
          })
        ) : (
          <div>Keine Elemente vorhanden</div>
        )}
      </ButtonContainer>
    </Container>
  )
}

const mapStateToProps = (state: State): ClipboardProps => ({
  plugins: getPlugins(state),
  clipboard: getClipboard(state),
  defaultPlugin: getDefaultPlugin(state)
})

export const ClipboardProvider = connect(mapStateToProps)(Clipboard)

export interface ClipboardProps {
  plugins: Record<string, Plugin>
  clipboard: PluginState[]
  defaultPlugin: string
}
