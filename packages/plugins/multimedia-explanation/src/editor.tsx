import { useScopedSelector } from '@edtr-io/core'
import { styled } from '@edtr-io/editor-ui'
import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import { getDocument, isFocused } from '@edtr-io/store'
import * as React from 'react'

import { MultimediaExplanationState, PluginRegistry } from '.'

const Floating = styled.div<{ floating: boolean }>(props => {
  return {
    ...(props.floating
      ? {
          width: '50%',
          float: 'right',
          zIndex: 10
        }
      : {}),
    padding: '5px',
    position: 'relative'
  }
})

const Clear = styled.div({
  clear: 'both'
})

const Container = styled.div<{ focused: boolean }>(props => {
  return {
    border: props.focused ? '2px solid #ccc' : ''
  }
})

const Start = styled.div({
  textAlign: 'center'
})

const FlexWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  '> div': {
    flex: 1
  }
})

export function createMultimediaExplanationEditor(
  multimediaPlugins: PluginRegistry
) {
  return function MultimediaExplanationEditor(
    props: StatefulPluginEditorProps<MultimediaExplanationState> & {
      renderIntoExtendedSettings?: (
        children: React.ReactNode
      ) => React.ReactNode
    }
  ) {
    function handleIllustratingChange(e: React.ChangeEvent<HTMLSelectElement>) {
      props.state.illustrating.set(e.target.value === 'illustrating')
    }

    const IllustratingSelection = (
      <React.Fragment>
        <div style={{ flex: 1 }}>
          <strong>Wie wichtig ist der Multimedia Inhalt?</strong>
        </div>
        <div style={{ flex: 1 }}>
          <select
            value={
              props.state.illustrating.value ? 'illustrating' : 'explaining'
            }
            onChange={handleIllustratingChange}
          >
            <option value="illustrating">
              Es ist nur eine Veranschaulichung
            </option>
            <option value="explaining">Es spielt eine zentrale Rolle</option>
          </select>
        </div>
      </React.Fragment>
    )

    const multimediaFocused = useScopedSelector(
      isFocused(props.state.multimedia.id)
    )
    const multimedia = useScopedSelector(getDocument(props.state.multimedia.id))
    function handleMultimediaChange(e: React.ChangeEvent<HTMLSelectElement>) {
      props.state.multimedia.replace(e.target.value)
    }
    const PluginSelection = (
      <select
        value={multimedia ? multimedia.plugin : ''}
        onChange={handleMultimediaChange}
      >
        {multimediaPlugins.map((plugin, i) => {
          return (
            <option key={i} value={plugin.name}>
              {plugin.title}
            </option>
          )
        })}
      </select>
    )

    return (
      <React.Fragment>
        {props.state.initialized.value ? (
          <React.Fragment>
            <Container focused={props.focused || multimediaFocused}>
              <Floating floating={props.state.illustrating.value}>
                {props.state.multimedia.render()}
              </Floating>
              {props.state.explanation.render()}
              <Clear />
            </Container>
            {props.renderIntoExtendedSettings
              ? props.renderIntoExtendedSettings(
                  <React.Fragment>
                    <hr />
                    {IllustratingSelection}
                    <div>
                      <strong>Tausche das Multimedia Element:</strong>
                      {PluginSelection}
                    </div>
                  </React.Fragment>
                )
              : null}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <FlexWrapper>
              {IllustratingSelection}
              <div>
                <strong>Wähle das Multimedia Element:</strong>
                {PluginSelection}
              </div>
            </FlexWrapper>
            <Start>
              <button onClick={() => props.state.initialized.set(true)}>
                OK
              </button>
            </Start>
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}
