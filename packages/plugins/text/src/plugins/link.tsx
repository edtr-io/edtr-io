import { styled } from '@edtr-io/editor-ui'
import { Icon, faExternalLinkAlt } from '@edtr-io/ui'
import isHotkey from 'is-hotkey'
import * as React from 'react'
import { Inline } from 'slate'
import { Editor } from 'slate-react'

import {
  NodeControlsProps,
  InlineEditorProps,
  InlineRendererProps,
  TextPlugin
} from '..'
import { trimSelection } from '../helpers'
import { I18nContext } from '../i18n-context'
import { linkNode } from '../model'
import { InlineInput } from './inline-input'
import { InlineSettings } from './inline-settings'

const OpenInNewTab = styled.span({ margin: '0 0 0 10px' })

export const isLink = (editor: Editor) => {
  return editor.value.inlines.some(inline =>
    inline ? inline.type === linkNode : false
  )
}

export const unwrapLink = (editor: Editor) => {
  return editor.unwrapInline(linkNode)
}

export const wrapLink = (data: { href: string } = { href: '' }) => (
  editor: Editor
) => {
  if (editor.value.selection.isExpanded) {
    trimSelection(editor)
    return editor
      .wrapInline({
        type: linkNode,
        data
      })
      .moveToEnd()
      .focus()
      .moveBackward(1)
  }

  return editor
    .insertText(' ')
    .focus()
    .moveFocusBackward(1)
    .wrapInline({
      type: linkNode,
      data
    })
    .moveToStart()
}

export interface LinkPluginOptions {
  EditorComponent?: React.ComponentType<InlineEditorProps>
  RenderComponent?: React.ComponentType<InlineRendererProps>
  ControlsComponent?: React.ComponentType<NodeControlsProps>
}

const DefaultEditorComponent: React.FunctionComponent<InlineEditorProps> = props => {
  const { attributes, children, node, isSelected } = props
  const href = node.data.get('href')

  return (
    <a
      {...attributes}
      href={href}
      style={
        isSelected
          ? {
              textDecoration: 'underline'
            }
          : undefined
      }
    >
      {children}
    </a>
  )
}

const DefaultControlsComponent: React.FunctionComponent<NodeControlsProps> = props => {
  const i18n = React.useContext(I18nContext)
  const { editor } = props
  const inline = editor.value.inlines.find(nodeIsLink)
  const lastInline = React.useRef(inline)
  const [value, setValue] = React.useState(
    inline ? inline.data.get('href') : undefined
  )
  const edit =
    !props.readOnly && isLink(editor) && editor.value.selection.isCollapsed
  const lastEdit = React.useRef(edit)

  React.useEffect(() => {
    if (lastEdit.current !== edit) {
      if (inline && value !== inline.data.get('href')) {
        handleHrefChange(value, inline, editor)
      }
      lastEdit.current = edit
    }
  }, [edit, inline, value, editor])

  if (!inline) return <React.Fragment>{props.children}</React.Fragment>

  if (value === undefined || lastInline.current.key !== inline.key) {
    const href = inline.data.get('href')
    setValue(href)
    lastInline.current = inline
  }
  function handleHrefChange(href: string, inline: Inline, editor: Editor) {
    editor.setNodeByKey(inline.key, {
      type: inline.type,
      data: {
        href
      }
    })
  }

  function nodeIsLink(inline: Inline | undefined) {
    return inline ? inline.type === linkNode : false
  }

  return (
    <React.Fragment>
      {props.children}
      {!props.readOnly &&
      isLink(editor) &&
      editor.value.selection.isCollapsed ? (
        <InlineSettings
          key={`inlineoverlay${inline.key}`}
          onDelete={() => unwrapLink(editor).focus()}
          position="below"
        >
          <InlineInput
            value={value}
            placeholder={i18n.link.placeholder}
            onChange={event => {
              const newValue = event.target.value
              setValue(newValue)
              handleHrefChange(newValue, inline, editor)
            }}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleHrefChange(value, inline, editor)
                editor.focus()
              }
            }}
            onBlur={event => {
              const value = event.target.value
              if (new RegExp('^([_\\-a-zA-Z0-9.]+\\.[\\w]{2,})').test(value)) {
                setValue(`https://${value}`)
              }
            }}
            //@ts-ignore FIXME
            ref={(ref: InlineInput | null) => {
              if (!ref) return
              if (!lastEdit.current && !value) {
                setTimeout(() => {
                  editor.blur()
                  setTimeout(() => {
                    ref.focus()
                  })
                })
              }
            }}
          />
          <a target="_blank" href={value} rel="noopener noreferrer">
            <OpenInNewTab title={i18n.link.openInNewTabTitle}>
              <Icon icon={faExternalLinkAlt} />
            </OpenInNewTab>
          </a>
        </InlineSettings>
      ) : null}
    </React.Fragment>
  )
}

export const createLinkPlugin = ({
  EditorComponent = DefaultEditorComponent,
  ControlsComponent = DefaultControlsComponent
}: LinkPluginOptions = {}) => (): TextPlugin => {
  return {
    onKeyDown(event, editor, next) {
      const e = (event as unknown) as KeyboardEvent
      if (isHotkey('mod+k', e)) {
        e.preventDefault()
        return isLink(editor) ? unwrapLink(editor) : wrapLink()(editor)
      }

      return next()
    },

    renderInline(props, _editor, next) {
      const block = props.node

      if (block.type === linkNode) {
        return <EditorComponent {...props} />
      }

      return next()
    },

    renderEditor(props, editor, next) {
      const children = next()

      if (props.readOnly) return children
      return (
        <ControlsComponent {...props} editor={editor}>
          {children}
        </ControlsComponent>
      )
    }
  }
}
