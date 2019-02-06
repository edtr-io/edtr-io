import * as React from 'react'
import { Editor } from 'slate'
import { EditorProps } from 'slate-react'
import {
  toggleEmphasize,
  isEmphasized,
  toggleStrong,
  isStrong
} from '../plugins/rich-text'
import { Button, ButtonGroup } from '../toolbar/button'
import { TextPlugin } from '..'
import { isLink, unwrapLink, wrapLink } from '../plugins/link'
import { Icon, faLink, faBold, faItalic } from '@edtr-io/ui'

export class Controls extends React.Component<{ editor: Editor }> {
  public render() {
    const { editor } = this.props
    return (
      <ButtonGroup>
        <Button active={isStrong(editor)} onClick={() => toggleStrong(editor)}>
          <Icon icon={faBold} />
        </Button>
        <Button
          active={isEmphasized(editor)}
          onClick={() => toggleEmphasize(editor)}
        >
          <Icon icon={faItalic} />
        </Button>
        <Button
          active={isLink(editor)}
          onClick={() =>
            isLink(editor) ? unwrapLink(editor) : wrapLink()(editor)
          }
        >
          <Icon icon={faLink} />
        </Button>
      </ButtonGroup>
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

export const createUiPlugin = (options: UiPluginOptions): TextPlugin => {
  const { Component } = options

  return {
    renderEditor(props, editor, next) {
      const children = next()
      return (
        <React.Fragment>
          <Component editor={editor} {...props} />
          {children}
          {/*{focused ? <Component editor={editor} {...props} /> : null}*/}
        </React.Fragment>
      )
    }
  }
}
