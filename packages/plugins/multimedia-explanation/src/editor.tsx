import * as React from 'react'
import { StatefulPluginEditorProps } from '@edtr-io/core'
import { EditorCheckbox, styled } from '@edtr-io/editor-ui'

import { multimediaExplanationState, PluginRegistry } from './index'

const Floating = styled.div<{ floating: boolean }>(props => {
  return {
    ...(props.floating
      ? {
          maxWidth: '50%',
          float: 'right',
          zIndex: 10,
          position: 'relative'
        }
      : {}),
    padding: '5px'
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

export function createMultimediaExplanationEditor(
  multimediaPlugins: PluginRegistry
) {
  return function MultimediaExplanationEditor(
    props: StatefulPluginEditorProps<typeof multimediaExplanationState> & {
      renderIntoExtendedSettings?: (
        children: React.ReactNode
      ) => React.ReactNode
    }
  ) {
    function handleIllustratingChange(e: React.ChangeEvent<HTMLSelectElement>) {
      props.state.illustrating.set(e.target.value === 'illustrating')
    }

    const IllustratingSelection = (
      <div>
        <strong>Wie wichtig ist der Multimedia Inhalt?</strong>
        <select
          value={props.state.illustrating.value ? 'illustrating' : 'explaining'}
          onChange={handleIllustratingChange}
        >
          <option value="illustrating">
            Es ist nur eine Veranschaulichung
          </option>
          <option value="explaining">Es spielt eine zentrale Rolle</option>
        </select>
      </div>
    )

    const PluginSelection = multimediaPlugins.map((plugin, i) => {
      return <button key={i} onClick={() => {
        props.state.multimedia.replace(plugin.name)
        props.state.initialized.set(true);
      }}>{ plugin.title }</button>
    })

    return (
      <React.Fragment>
        {props.state.initialized.value ? (
          <React.Fragment>
            <Container focused={props.focused || false}>
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
                      { PluginSelection }
                    </div>
                  </React.Fragment>
                )
              : null}
          </React.Fragment>
        ) : (
          <React.Fragment>
            { IllustratingSelection }
            <div>
              <strong>Wähle das Multimedia Element:</strong>
              { PluginSelection }
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}
