import { debounce } from 'lodash'
import {
  Input,
  OverlayButton,
  renderIntoOverlay,
  showOverlay
} from '@edtr-io/ui'
import { Editor, Data, InlineJSON, Inline } from 'slate'
import * as React from 'react'
import { NodeEditorProps, NodeRendererProps, TextPlugin } from '..'

export const linkNode = '@splish-me/a'

export interface LinkPluginOptions {
  EditorComponent?: React.ComponentType<NodeEditorProps>
  RenderComponent?: React.ComponentType<NodeRendererProps>
}

interface DefaultEditorComponentState {
  lastValue: string
  value: string
}

class DefaultEditorComponent extends React.Component<
  NodeEditorProps,
  DefaultEditorComponentState
> {
  public state: DefaultEditorComponentState = {
    lastValue: this.props.node.data.get('href'),
    value: this.props.node.data.get('href')
  }

  private handleHrefChange = debounce((href: string) => {
    const { editor, node } = this.props
    const inline = node

    editor
      .setNodeByKey(inline.key, {
        type: inline.type,
        data: {
          href
        }
      })
      .focus()

    //FIXME: input field is loosing focus, but this doesn't work
    // setTimeout(() => {
    //   const input = this.input.current
    //   if (input) {
    //     input.focus()
    //   }
    // })
  }, 500)

  private input = React.createRef<Input>() as React.RefObject<Input> & string

  public static getDerivedStateFromProps(
    props: NodeEditorProps,
    state: DefaultEditorComponentState
  ): DefaultEditorComponentState | null {
    const newValue = props.node.data.get('href')

    if (newValue === state.lastValue) {
      return null
    }

    return {
      lastValue: newValue,
      value: newValue
    }
  }

  public render() {
    const { attributes, children, node, isSelected } = this.props
    const inline = node
    const { value } = this.state

    const href = inline.data.get('href')

    return (
      <React.Fragment>
        <a {...attributes} href={href}>
          {children}
        </a>
        {isSelected
          ? renderIntoOverlay(
              <React.Fragment>
                <Input
                  ref={this.input}
                  label="URL"
                  value={value}
                  onChange={e => {
                    const newValue = e.target.value

                    this.setState({ value: newValue })
                    this.handleHrefChange(newValue)
                  }}
                />
              </React.Fragment>
            )
          : null}
        {isSelected ? <OverlayButton positionAtElement /> : null}
      </React.Fragment>
    )
  }
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
    return unwrapLink(editor)
      .wrapInline({
        type: linkNode,
        data
      })
      .moveToEnd()
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

export const createLinkPlugin = ({
  EditorComponent = DefaultEditorComponent, //FIXME
  RenderComponent = DefaultRendererComponent
}: LinkPluginOptions = {}): TextPlugin => {
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
        isLink(editor)
      ) {
        showOverlay()
        return
      }
      next()
    },

    renderNode(props, _editor, next) {
      const block = props.node

      if (block.object === 'inline' && block.type === linkNode) {
        return <EditorComponent {...props} />
      }

      return next()
    }
  }
}
