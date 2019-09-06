import {
  PrimarySettings,
  EditorInput,
  OverlayInput,
  PreviewOverlay
} from '@edtr-io/editor-ui'
import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import * as React from 'react'

import { serloInjectionState } from '.'
import { SerloInjectionRenderer } from './renderer'

const createURL = (id: string) => {
  if (id.startsWith('/') || id.startsWith('\\')) {
    return (
      'https://de.serlo.org/' +
      id.substring(1, id.length) +
      '?contentOnly&hideBreadcrumbs'
    )
  }
  return 'https://de.serlo.org/' + id + '?contentOnly&hideBreadcrumbs'
}

export const SerloInjectionEditor = (
  props: StatefulPluginEditorProps<typeof serloInjectionState> & {
    renderIntoExtendedSettings?: (children: React.ReactNode) => React.ReactNode
  }
) => {
  return props.editable ? (
    <React.Fragment>
      <PreviewOverlay focused={props.focused || false}>
        <SerloInjectionRenderer src={createURL(props.state.value)} />
      </PreviewOverlay>
      {props.focused ? (
        <PrimarySettings>
          <EditorInput
            label="Serlo ID:"
            placeholder="123456"
            value={props.state.value}
            onChange={e => {
              props.state.set(e.target.value)
            }}
            textfieldWidth="30%"
            editorInputWidth="100%"
          />
        </PrimarySettings>
      ) : null}
      {props.renderIntoExtendedSettings
        ? props.renderIntoExtendedSettings(
            <OverlayInput
              label="Serlo ID:"
              placeholder="123456"
              value={props.state.value}
              onChange={e => {
                props.state.set(e.target.value)
              }}
            />
          )
        : null}
    </React.Fragment>
  ) : (
    <SerloInjectionRenderer src={createURL(props.state.value)} />
  )
}
