import * as React from 'react'
import { Editor } from 'slate'
import { EditorProps } from 'slate-react'
import {
  toggleEmphasize,
  isEmphasized,
  toggleStrong,
  isStrong
} from '../plugins/rich-text'
import { Button } from '../toolbar/button'
import { TextPlugin } from '..'
import { isLink, unwrapLink, wrapLink } from '../plugins/link'
import {
  Icon,
  faLink,
  faBold,
  faItalic,
  faUnlink,
  HoveringOverlay
} from '@edtr-io/ui'
import { OverlayContext } from '@edtr-io/core'

export const Controls: React.FunctionComponent<{ editor: Editor }> = props => {
  const { editor } = props
  const overlayContext = React.useContext(OverlayContext)
  if (
    editor.value.selection.isCollapsed &&
    ((!isStrong(editor) && !isEmphasized(editor)) || isLink(editor))
  ) {
    return null
  } else {
    return (
      <HoveringOverlay position={'above'}>
        <Button
          active={isStrong(editor)}
          onClick={() => toggleStrong(editor).focus()}
        >
          <Icon icon={faBold} />
        </Button>
        <Button
          active={isEmphasized(editor)}
          onClick={() => toggleEmphasize(editor).focus()}
        >
          <Icon icon={faItalic} />
        </Button>
        <Button
          active={isLink(editor)}
          onClick={() =>
            isLink(editor)
              ? unwrapLink(editor).focus()
              : wrapLink()(editor, overlayContext)
          }
        >
          <Icon icon={isLink(editor) ? faUnlink : faLink} />
        </Button>
      </HoveringOverlay>
    )
  }
}

export interface UiPluginOptions {
  Component: React.ComponentType<
    Partial<EditorProps> & {
      editor: Editor
    }
  >
}

export const createUiPlugin = (options: UiPluginOptions) => (): TextPlugin => {
  const { Component } = options

  return {
    renderEditor(props, editor, next) {
      const { readOnly } = props
      if (readOnly) {
        editor.blur()
      }
      const children = next()
      return (
        <React.Fragment>
          {!readOnly ? <Component editor={editor} {...props} /> : null}
          {children}
        </React.Fragment>
      )
    }
  }
}
