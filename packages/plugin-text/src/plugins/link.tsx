import { InlineInput, InlineSettings } from '@edtr-io/editor-ui'
import { Editor, Data, InlineJSON, Inline } from 'slate'
import * as React from 'react'
import {
  NodeControlsProps,
  NodeEditorProps,
  NodeRendererProps,
  TextPlugin,
  trimSelection
} from '..'
import isHotkey from 'is-hotkey'

export const linkNode = '@splish-me/a'

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
  EditorComponent?: React.ComponentType<NodeEditorProps>
  RenderComponent?: React.ComponentType<NodeRendererProps>
  ControlsComponent?: React.ComponentType<NodeControlsProps>
}

const DefaultEditorComponent: React.FunctionComponent<
  NodeEditorProps
> = props => {
  const { attributes, children, node, isSelected } = props
  const inline = node
  const href = inline.data.get('href')

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

const DefaultControlsComponent: React.FunctionComponent<
  NodeControlsProps
> = props => {
  console.log('asdfasd')
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
          position={'below'}
        >
          <InlineInput
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newValue = e.target.value
              setValue(newValue)
              handleHrefChange(newValue, inline, editor)
            }}
            onKeyDown={(event: React.KeyboardEvent) => {
              if (((event as unknown) as React.KeyboardEvent).key === 'Enter') {
                event.preventDefault()
                handleHrefChange(value, inline, editor)
                editor.focus()
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
        </InlineSettings>
      ) : null}
    </React.Fragment>
  )
}

class DefaultRendererComponent extends React.Component<NodeRendererProps> {
  public render() {
    const { children, node } = this.props
    const { data } = node as InlineJSON

    if (!data) {
      return null
    }

    return <a href={data.href}>{children}</a>
  }
}

export const createLinkPlugin = ({
  EditorComponent = DefaultEditorComponent,
  RenderComponent = DefaultRendererComponent,
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
    deserialize(el, next) {
      if (el.tagName.toLowerCase() === 'a') {
        // @ts-ignore FIXME
        const attr = el.attrs.find(({ name }) => name === 'href')

        return {
          object: 'inline',
          type: linkNode,
          nodes: next(el.childNodes),
          data: Data.create({
            href: attr ? attr.value : ''
          })
        }
      }
    },

    serialize(obj, children) {
      const block = obj as Inline

      if (block.object === 'inline' && block.type === linkNode) {
        return <RenderComponent node={obj}>{children}</RenderComponent>
      }
    },

    renderNode(props, _editor, next) {
      const block = props.node

      if (block.object === 'inline' && block.type === linkNode) {
        return <EditorComponent {...props} />
      }

      return next()
    },

    renderEditor(props, editor, next) {
      const children = next()
      return props.readOnly ? (
        children
      ) : (
        <ControlsComponent {...props} editor={editor}>
          {children}
        </ControlsComponent>
      )
    }
  }
}
