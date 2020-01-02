import { EdtrIcon, edtrTextControls } from '@edtr-io/ui'
import * as React from 'react'

import { SubControlProps, VisibleControls } from '.'
import { orderedListNode, unorderedListNode } from '../model'
import {
  createBlockquote,
  isBlockquote,
  removeBlockquote
} from '../plugins/blockquote'
import { getColorIndex } from '../plugins/colors'
import { getHeadingLevel } from '../plugins/headings'
import { insertKatex, isKatex, removeKatex } from '../plugins/katex'
import { isLink, unwrapLink, wrapLink } from '../plugins/link'
import { isList, toggleList } from '../plugins/list'
import {
  isEmphasized,
  isStrong,
  toggleEmphasize,
  toggleStrong
} from '../plugins/rich-text'
import { Button } from '../toolbar/button'
import { ColoredTextIcon } from './colors'

export function DefaultControls(props: SubControlProps) {
  const { editor, config, pluginClosure } = props
  return (
    <React.Fragment>
      <Button
        config={config}
        active={isStrong(editor)}
        onClick={() => {
          toggleStrong(editor).focus()
          props.onChange(editor)
        }}
        title="Fett (Strg + B)"
      >
        <EdtrIcon icon={edtrTextControls.bold} />
      </Button>
      <Button
        config={config}
        active={isEmphasized(editor)}
        onClick={() => {
          toggleEmphasize(editor).focus()
          props.onChange(editor)
        }}
        title="Kursiv (Strg + I)"
      >
        <EdtrIcon icon={edtrTextControls.italic} />
      </Button>
      <Button
        config={config}
        active={isLink(editor)}
        onClick={() => {
          isLink(editor) ? unwrapLink(editor).focus() : wrapLink()(editor)
          props.onChange(editor)
        }}
        title="Link (Strg + K)"
      >
        <EdtrIcon icon={edtrTextControls.link} />
      </Button>
      <Button
        config={config}
        active={!!getHeadingLevel(props.editor)}
        onClick={() => {
          props.switchControls(VisibleControls.Headings)
        }}
        title="Überschriften"
      >
        <EdtrIcon icon={edtrTextControls.text} />
      </Button>
      <Button
        config={config}
        onClick={() => props.switchControls(VisibleControls.Colors)}
        title="Textfarben"
      >
        <ColoredTextIcon config={props.config} index={getColorIndex(editor)} />
      </Button>
      <Button
        config={config}
        onClick={() => {
          if (
            !isList(unorderedListNode)(editor) &&
            !isList(orderedListNode)(editor)
          ) {
            toggleList(unorderedListNode)(props.editor).focus()
            props.onChange(editor)
          }
          props.switchControls(VisibleControls.Lists)
        }}
        title="Listen"
      >
        <EdtrIcon
          icon={
            isList(orderedListNode)(editor)
              ? edtrTextControls.listNumbered
              : edtrTextControls.listBullets
          }
        />
      </Button>
      <Button
        config={config}
        active={isBlockquote(editor, pluginClosure)}
        onClick={() => {
          if (isBlockquote(editor, pluginClosure)) {
            removeBlockquote(editor, pluginClosure)
            props.onChange(editor)
          } else {
            createBlockquote(editor, name)
            props.onChange(editor)
          }
        }}
        title="Zitat"
      >
        <EdtrIcon icon={edtrTextControls.quote} />
      </Button>
      <Button
        config={config}
        active={isKatex(editor)}
        onClick={() => {
          isKatex(editor) ? removeKatex(editor).focus() : insertKatex(editor)
          props.onChange(editor)
        }}
        title="Matheformel (Strg + M)"
      >
        <EdtrIcon icon={edtrTextControls.formel} />
      </Button>
    </React.Fragment>
  )
}
