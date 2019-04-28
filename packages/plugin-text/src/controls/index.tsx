import * as React from 'react'
import { Editor } from 'slate'
import { EditorProps } from 'slate-react'
import { TextPlugin } from '..'
import { HoveringOverlay, BottomToolbar } from '@edtr-io/editor-ui'
import { SlatePluginClosure } from '../factory/types'
import { DefaultControls } from './default'
import { HeadingControls } from './headings'

export enum VisibleControls {
  All,
  Headings
}

export interface ControlProps {
  editor: Editor
  name: string
  readOnly?: boolean
}

export interface UiPluginOptions {
  Component: React.ComponentType<Partial<EditorProps> & ControlProps>
}

const ControlsSwitch: React.FunctionComponent<{
  editor: Editor
  name: string
}> = props => {
  const [visibleControls, setVisibleControls] = React.useState(
    VisibleControls.All
  )
  switch (visibleControls) {
    case VisibleControls.All:
      return <DefaultControls {...props} switchControls={setVisibleControls} />
    case VisibleControls.Headings:
      return <HeadingControls {...props} switchControls={setVisibleControls} />
  }
}

export const Controls: React.FunctionComponent<ControlProps> = props => {
  const selectionCollapsed = props.editor.value.selection.isCollapsed
  return (
    <React.Fragment>
      {!selectionCollapsed && (
        <HoveringOverlay position={'above'}>
          <ControlsSwitch {...props} />
        </HoveringOverlay>
      )}
      {!props.readOnly && selectionCollapsed && (
        <BottomToolbar>
          <ControlsSwitch {...props} />
        </BottomToolbar>
      )}
    </React.Fragment>
  )
}

export const createUiPlugin = (options: UiPluginOptions) => (
  pluginClosure: SlatePluginClosure
): TextPlugin => {
  const { Component } = options

  return {
    renderEditor(props, editor, next) {
      const { readOnly } = props
      if (readOnly) {
        editor.blur()
      }
      const name = pluginClosure.current ? pluginClosure.current.name : ''
      const children = next()
      return (
        <React.Fragment>
          {!readOnly ? (
            <Component editor={editor} {...props} name={name} />
          ) : null}
          {children}
        </React.Fragment>
      )
    }
  }
}
