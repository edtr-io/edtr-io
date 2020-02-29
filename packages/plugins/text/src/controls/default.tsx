import {
  edtrBold,
  edtrFormula,
  EdtrIcon,
  edtrItalic,
  edtrLink,
  edtrListBullets,
  edtrListNumbered,
  edtrQuote,
  edtrText
} from '@edtr-io/ui'
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
  const { editor, config, pluginClosure, plugins } = props
  return (
    <React.Fragment>
      <Button
        config={config}
        active={isStrong(editor)}
        onClick={() => {
          toggleStrong(editor).focus()
          props.onChange(editor)
        }}
        title={config.i18n.richText.toggleStrongTitle}
      >
        <EdtrIcon icon={edtrBold} />
      </Button>
      <Button
        config={config}
        active={isEmphasized(editor)}
        onClick={() => {
          toggleEmphasize(editor).focus()
          props.onChange(editor)
        }}
        title={config.i18n.richText.toggleEmphasizeTitle}
      >
        <EdtrIcon icon={edtrItalic} />
      </Button>
      <Button
        config={config}
        active={isLink(editor)}
        onClick={() => {
          isLink(editor) ? unwrapLink(editor).focus() : wrapLink()(editor)
          props.onChange(editor)
        }}
        title={config.i18n.link.toggleTitle}
      >
        <EdtrIcon icon={edtrLink} />
      </Button>
      {plugins.headings ? (
        <Button
          config={config}
          active={!!getHeadingLevel(props.editor)}
          onClick={() => {
            props.switchControls(VisibleControls.Headings)
          }}
          title={config.i18n.headings.openMenuTitle}
        >
          <EdtrIcon icon={edtrText} />
        </Button>
      ) : null}
      {plugins.colors ? (
        <Button
          config={config}
          onClick={() => props.switchControls(VisibleControls.Colors)}
          title={config.i18n.colors.openMenuTitle}
        >
          <ColoredTextIcon
            config={props.config}
            index={getColorIndex(editor)}
          />
        </Button>
      ) : null}
      {plugins.lists ? (
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
          title={config.i18n.list.openMenuTitle}
        >
          <EdtrIcon
            icon={
              isList(orderedListNode)(editor)
                ? edtrListNumbered
                : edtrListBullets
            }
          />
        </Button>
      ) : null}
      {config.blockquote ? (
        <Button
          config={config}
          active={isBlockquote(editor, pluginClosure)}
          onClick={() => {
            if (isBlockquote(editor, pluginClosure)) {
              removeBlockquote(editor, pluginClosure)
              props.onChange(editor)
            } else {
              createBlockquote(editor, pluginClosure)
              props.onChange(editor)
            }
          }}
          title={config.i18n.blockquote.toggleTitle}
        >
          <EdtrIcon icon={edtrQuote} />
        </Button>
      ) : null}
      {plugins.math ? (
        <Button
          config={config}
          active={isKatex(editor)}
          onClick={() => {
            isKatex(editor) ? removeKatex(editor).focus() : insertKatex(editor)
            props.onChange(editor)
          }}
          title={config.i18n.math.toggleTitle}
        >
          <EdtrIcon icon={edtrFormula} />
        </Button>
      ) : null}
    </React.Fragment>
  )
}
