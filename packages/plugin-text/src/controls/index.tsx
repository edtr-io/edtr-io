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
  HoveringOverlay,
  BottomToolbar
} from '@edtr-io/editor-ui'
import { OverlayContext } from '@edtr-io/core'
import { insertKatex, isKatex } from '../plugins/katex'

export const Controls: React.FunctionComponent<{
  editor: Editor
  readOnly?: boolean
}> = props => {
  const { editor } = props
  const overlayContext = React.useContext(OverlayContext)
  return (
    <React.Fragment>
      {editor.value.selection.isCollapsed &&
      ((!isStrong(editor) && !isEmphasized(editor)) ||
        isLink(editor)) ? null : (
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
            <Icon icon={faLink} />
          </Button>
        </HoveringOverlay>
      )}
      {!props.readOnly && (
        <BottomToolbar>
          <Button
            active={false}
            onClick={() => {
              const active = isKatex(editor)

              if (!active) {
                insertKatex(editor)
              }
            }}
          >
            f(x)
          </Button>
        </BottomToolbar>
      )}
    </React.Fragment>
  )
}

export interface UiPluginOptions {
  Component: React.ComponentType<
    Partial<EditorProps> & {
      editor: Editor
      readOnly?: boolean
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
