import * as React from 'react'

import { EdtrIcon, edtrIconSet } from '@edtr-io/editor-ui'

import { Button } from '../toolbar/button'
import {
  isEmphasized,
  isStrong,
  toggleEmphasize,
  toggleStrong
} from '../plugins/rich-text'
import { isLink, unwrapLink, wrapLink } from '../plugins/link'
import { insertKatex, isKatex, removeKatex } from '../plugins/katex'
import { ControlProps, VisibleControls } from '.'
import {
  isList,
  orderedListNode,
  toggleList,
  unorderedListNode
} from '../plugins/list'
import { ColoredTextIcon } from './colors'
import { getColorIndex } from '../plugins/colors'

export const DefaultControls: React.FunctionComponent<
  ControlProps & { switchControls: (controlType: VisibleControls) => void }
> = props => {
  const { editor, name } = props
  return (
    <React.Fragment>
      <Button
        name={name}
        active={isStrong(editor)}
        onClick={() => {
          toggleStrong(editor).focus()
        }}
        title="Fett (Strg + B)"
      >
        <EdtrIcon icon={edtrIconSet.bold} />
      </Button>
      <Button
        name={name}
        active={isEmphasized(editor)}
        onClick={() => {
          toggleEmphasize(editor).focus()
        }}
        title="Kursiv (Strg + I)"
      >
        <EdtrIcon icon={edtrIconSet.italic} />
      </Button>
      <Button
        name={name}
        active={isLink(editor)}
        onClick={() =>
          isLink(editor) ? unwrapLink(editor).focus() : wrapLink()(editor)
        }
        title="Link (Strg + K)"
      >
        <EdtrIcon icon={edtrIconSet.link} />
      </Button>
      <Button
        name={name}
        onClick={() => props.switchControls(VisibleControls.Headings)}
        title={'Überschriften'}
      >
        <EdtrIcon icon={edtrIconSet.text} />
      </Button>
      <Button
        name={name}
        onClick={() => props.switchControls(VisibleControls.Colors)}
        title={'Textfarben'}
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
            toggleList(unorderedListNode)(props.editor)
          }
          props.switchControls(VisibleControls.Lists)
        }}
        title={'Listen'}
      >
        <EdtrIcon
          icon={
            isList(orderedListNode)(editor)
              ? edtrIconSet.listNumbered
              : edtrIconSet.listBullets
          }
        />
      </Button>
      <Button
        name={name}
        onClick={() => {
          editor.command('replaceWithPlugin', {
            plugin: 'blockquote',
            state: {
              plugin: name,
              state: editor.value.toJSON()
            }
          })
        }}
        title={'Zitat'}
      >
        <EdtrIcon icon={edtrIconSet.quote} />
      </Button>
      <Button
        name={name}
        active={isKatex(editor)}
        onClick={() =>
          isKatex(editor) ? removeKatex(editor).focus() : insertKatex(editor)
        }
        title="Matheformel (Strg + M)"
      >
        <EdtrIcon icon={edtrIconSet.formel} />
      </Button>
    </React.Fragment>
  )
}
