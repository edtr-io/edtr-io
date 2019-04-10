import { debounce } from 'lodash'
import { AutoFocusInput, InlineSettings, Overlay } from '@edtr-io/ui'
import { Editor, Data, InlineJSON, Inline } from 'slate'
import * as React from 'react'
import {
  NodeControlsProps,
  NodeEditorProps,
  NodeRendererProps,
  TextPlugin
} from '..'
import { OverlayContext, OverlayContextValue } from '@edtr-io/core'
import { SlatePluginClosure } from '../factory/types'

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
  editor: Editor,
  overlayContext: OverlayContextValue
) => {
  setTimeout(overlayContext.show)
  if (editor.value.selection.isExpanded) {
    return editor
      .wrapInline({
        type: linkNode,
        data
      })
      .moveToEnd()
      .moveBackward(1)
  }

  return editor
    .insertText(' ')
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
  const overlayContext = React.useContext(OverlayContext)
  const { editor } = props
  const inline = editor.value.inlines.find(nodeIsLink)
  const lastInline = React.useRef(inline)
  const [value, setValue] = React.useState(
    inline ? inline.data.get('href') : undefined
  )
  if (!inline) return <React.Fragment>{props.children}</React.Fragment>

  if (value === undefined || lastInline.current.key !== inline.key) {
    setValue(inline.data.get('href'))
    lastInline.current = inline
  }
  const handleHrefChange = debounce((href: string) => {
    editor.setNodeByKey(inline.key, {
      type: inline.type,
      data: {
        href
      }
    })
  }, 1000)

  function nodeIsLink(inline: Inline | undefined) {
    return inline ? inline.type === linkNode : false
  }

  return (
    <React.Fragment>
      {props.children}
      {!props.readOnly &&
      isLink(editor) &&
      !overlayContext.visible &&
      editor.value.selection.isCollapsed ? (
        <InlineSettings
          key={`inlineoverlay${inline.key}`}
          onEdit={overlayContext.show}
          onDelete={() => unwrapLink(editor)}
        >
          <a href={value} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        </InlineSettings>
      ) : null}
      {!props.readOnly && isLink(editor) ? (
        <Overlay key={`overlay${inline.key}`} onClose={() => editor.focus()}>
          <AutoFocusInput
            label="URL"
            value={value}
            onChange={e => {
              const newValue = e.target.value
              setValue(newValue)
              handleHrefChange(newValue)
            }}
          />
        </Overlay>
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
}: LinkPluginOptions = {}) => (
  pluginClosure: SlatePluginClosure
): TextPlugin => {
  return {
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

    onKeyDown(event, editor, next) {
      if (
        ((event as unknown) as React.KeyboardEvent).key === 'Enter' &&
        isLink(editor) &&
        pluginClosure.current
      ) {
        pluginClosure.current.overlayContext.show()
        return
      }
      return next()
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
      return (
        <ControlsComponent {...props} editor={editor}>
          {children}
        </ControlsComponent>
      )
    }
  }
}
