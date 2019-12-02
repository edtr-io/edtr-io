import { EdtrIcon, edtrTextControls } from '@edtr-io/ui'
import * as React from 'react'

import { SubControlProps, VisibleControls } from '.'
import {
  createBlockquote,
  isBlockquote,
  removeBlockquote
} from '../plugins/blockquote'
import { getColorIndex } from '../plugins/colors'
import { getHeadingLevel } from '../plugins/headings'
import { insertKatex, isKatex, removeKatex } from '../plugins/katex'
import { isLink, unwrapLink, wrapLink } from '../plugins/link'
import {
  isList,
  orderedListNode,
  toggleList,
  unorderedListNode
} from '../plugins/list'
import {
  isEmphasized,
  isStrong,
  toggleEmphasize,
  toggleStrong
} from '../plugins/rich-text'
import { isWordgap, setWordgap, unsetWordgap } from '../plugins/wordgap'
import { Button } from '../toolbar/button'
import { ColoredTextIcon } from './colors'

export const DefaultControls: React.FunctionComponent<
  SubControlProps
> = props => {
  const { editor, name, pluginClosure } = props
  return (
    <React.Fragment>
      <Button
        name={name}
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
        name={name}
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
        name={name}
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
        name={name}
        active={!!getHeadingLevel(props.editor)}
        onClick={() => {
          props.switchControls(VisibleControls.Headings)
        }}
        title="Überschriften"
      >
        <EdtrIcon icon={edtrTextControls.text} />
      </Button>
      <Button
        name={name}
        onClick={() => props.switchControls(VisibleControls.Colors)}
        title="Textfarben"
      >
        <ColoredTextIcon index={getColorIndex(editor)} />
      </Button>
      <Button
        name={name}
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
        name={name}
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
        name={name}
        active={isKatex(editor)}
        onClick={() => {
          isKatex(editor) ? removeKatex(editor).focus() : insertKatex(editor)
          props.onChange(editor)
        }}
        title="Matheformel (Strg + M)"
      >
        <EdtrIcon icon={edtrTextControls.formel} />
      </Button>
      <Button
        name={name}
        active={isWordgap(editor)}
        onClick={() => {
          console.log(isWordgap(editor))
          isWordgap(editor) ? unsetWordgap(editor) : setWordgap(editor)
          props.onChange(editor)
        }}
        title="Lückentext (Strg + g)"
      >
        _
      </Button>
    </React.Fragment>
  )
}
