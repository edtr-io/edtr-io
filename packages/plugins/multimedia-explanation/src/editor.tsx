import { PluginToolbarButton, useScopedSelector } from '@edtr-io/core'
import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import { getDocument, hasFocusedDescendant, isFocused } from '@edtr-io/store'
import { styled, faSyncAlt, EdtrIcon, edtrClose } from '@edtr-io/ui'
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

const Container = styled.div<{ hasFocus: boolean }>(props => {
  return {
    border: props.hasFocus ? '2px solid #ccc' : ''
  }
})

export function createMultimediaExplanationEditor(
  multimediaPlugins: PluginRegistry
) {
  return function MultimediaExplanationEditor(
    props: StatefulPluginEditorProps<MultimediaExplanationState>
  ) {
    function handleIllustratingChange(e: React.ChangeEvent<HTMLSelectElement>) {
      props.state.illustrating.set(e.target.value === 'illustrating')
    }
    const textFocused = useScopedSelector(hasFocusedDescendant(props.state.explanation.id))

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

    const MultimediaSettings = (
      <React.Fragment>
        <hr />
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
        <div>
          <strong>Tausche das Multimedia Element:</strong>
          {PluginSelection}
        </div>
      </React.Fragment>
    )

    return (
      <React.Fragment>
        <Container hasFocus={props.focused || multimediaFocused || textFocused}>
          <Floating floating={props.state.illustrating.value}>
            {props.state.multimedia.render({
              // renderToolbar(children) {
              //   return (
              //     <React.Fragment>
              //       <PluginToolbarButton
              //         icon={faSyncAlt}
              //         label="Tausche das Multimedia Element"
              //       />
              //       {children}
              //     </React.Fragment>
              //   )
              // },
              renderSettings(children) {
                return (
                  <React.Fragment>
                    {children}
                    {MultimediaSettings}
                  </React.Fragment>
                )
              }
            })}
          </Floating>
          {props.state.explanation.render()}
          <Clear />
        </Container>
        {props.editable ? props.renderIntoSettings(MultimediaSettings) : null}
      </React.Fragment>
    )
  }
}
