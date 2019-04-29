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
        onClick={() => toggleStrong(editor).focus()}
      >
        <Icon icon={faBold} />
      </Button>
      <Button
        name={name}
        active={isEmphasized(editor)}
        onClick={() => toggleEmphasize(editor).focus()}
      >
        <Icon icon={faItalic} />
      </Button>
      <Button
        name={name}
        active={isLink(editor)}
        onClick={() =>
          isLink(editor) ? unwrapLink(editor).focus() : wrapLink()(editor)
        }
      >
        <Icon icon={faLink} />
      </Button>
      <Button
        name={name}
        onClick={() => props.switchControls(VisibleControls.Headings)}
      >
        {getHeadingLevel(editor) ? `H${getHeadingLevel(editor)}` : 'T'}
      </Button>
      <Button
        name={name}
        onClick={() => props.switchControls(VisibleControls.Colors)}
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
      >
        <Icon icon={faQuoteLeft} />
      </Button>
      <Button
        name={name}
        active={isKatex(editor)}
        onClick={() =>
          isKatex(editor) ? removeKatex(editor).focus() : insertKatex(editor)
        }
      >
        f(x)
      </Button>
    </React.Fragment>
  )
}
