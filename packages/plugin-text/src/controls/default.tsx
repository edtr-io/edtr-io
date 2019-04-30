import * as React from 'react'
import {
  Icon,
  faBold,
  faItalic,
  faLink,
  faListUl,
  faQuoteLeft,
  faListOl
} from '@edtr-io/editor-ui'
import { Button } from '../toolbar/button'
import {
  isEmphasized,
  isStrong,
  toggleEmphasize,
  toggleStrong
} from '../plugins/rich-text'
import { isLink, unwrapLink, wrapLink } from '../plugins/link'
import { insertKatex, isKatex, removeKatex } from '../plugins/katex'
import { Math } from '../plugins/katex/math.component'
import { getHeadingLevel } from '../plugins/headings'
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
        <Icon icon={faBold} />
      </Button>
      <Button
        name={name}
        active={isEmphasized(editor)}
        onClick={() => {
          toggleEmphasize(editor).focus()
        }}
        title="Kursiv (Strg + I)"
      >
        <Icon icon={faItalic} />
      </Button>
      <Button
        name={name}
        active={isLink(editor)}
        onClick={() =>
          isLink(editor) ? unwrapLink(editor).focus() : wrapLink()(editor)
        }
        title="Link (Strg + K)"
      >
        <Icon icon={faLink} />
      </Button>
      <Button
        name={name}
        onClick={() => props.switchControls(VisibleControls.Headings)}
        title={'Überschriften'}
      >
        {getHeadingLevel(editor) ? `H${getHeadingLevel(editor)}` : 'T'}
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
        <Icon icon={isList(orderedListNode)(editor) ? faListOl : faListUl} />
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
        <Icon icon={faQuoteLeft} />
      </Button>
      <Button
        name={name}
        active={isKatex(editor)}
        onClick={() =>
          isKatex(editor) ? removeKatex(editor).focus() : insertKatex(editor)
        }
        title="Matheformel (Strg + M)"
      >
        <Math formula="f_{\normalsize x}" inline={true} />
      </Button>
    </React.Fragment>
  )
}
