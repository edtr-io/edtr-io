import * as React from 'react'
import * as R from 'ramda'
import { Block, Editor } from 'slate'

import { NodeEditorProps, NodeRendererProps, TextPlugin } from '..'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export const createHeadingNode = (level: HeadingLevel) => {
  return `@splish-me/h${level}`
}

export interface HeadingsPluginOptions {
  EditorComponent?: React.ComponentType<
    NodeEditorProps & { level: HeadingLevel }
  >
  RenderComponent?: React.ComponentType<
    NodeRendererProps & { level: HeadingLevel }
  >
}

const Heading = ({
  level,
  children,
  ...props
}: {
  level: number
  children: React.ReactNode
}) => {
  if (level <= 6 && level >= 1)
    return React.createElement(`h${level}`, props, children)
  else return <h6 {...props}>{children}</h6>
}

class DefaultEditorComponent extends React.Component<
  NodeEditorProps & { level: HeadingLevel }
> {
  public render() {
    const { attributes, children, level } = this.props

    return (
      <Heading level={level} {...attributes}>
        {children}
      </Heading>
    )
  }
}

class DefaultRenderComponent extends React.Component<
  NodeRendererProps & { level: HeadingLevel }
> {
  public render() {
    const { children, level } = this.props

    return <Heading level={level}>{children}</Heading>
  }
}

export const createIsHeading = (level: HeadingLevel) => {
  return (editor: Editor) => {
    const type = createHeadingNode(level)

    return editor.value.blocks.some(block =>
      block ? block.type === type : false
    )
  }
}

export const createSetHeading = (level: HeadingLevel) => {
  return (editor: Editor) => {
    const type = createHeadingNode(level)
    return editor.setBlocks(type)
  }
}

export const getHeadingLevel = (editor: Editor): HeadingLevel | undefined => {
  return R.find((level: HeadingLevel) => createIsHeading(level)(editor), [
    1,
    2,
    3,
    4,
    5,
    6
  ])
}

export const createHeadingsPlugin = ({
  EditorComponent = DefaultEditorComponent,
  RenderComponent = DefaultRenderComponent
}: HeadingsPluginOptions = {}) => (): TextPlugin => {
  return {
    deserialize(el, next) {
      const match = el.tagName.toLowerCase().match(/h([1-6])/)

      if (match) {
        const level = parseInt(match[1], 10) as HeadingLevel

        return {
          object: 'block',
          type: createHeadingNode(level),
          nodes: next(el.childNodes)
        }
      }
    },

    serialize(obj, children) {
      const block = obj as Block

      if (block.object === 'block') {
        const match = block.type.match(/@splish-me\/h([1-6])/)

        if (match) {
          const level = parseInt(match[1], 10) as HeadingLevel

          return (
            <RenderComponent level={level} node={obj}>
              {children}
            </RenderComponent>
          )
        }
      }
    },

    renderNode(props, _editor, next) {
      const block = props.node

      if (block.object === 'block') {
        const match = block.type.match(/@splish-me\/h([1-6])/)

        if (match) {
          const level = parseInt(match[1], 10) as HeadingLevel

          return <EditorComponent level={level} {...props} />
        }
      }

      return next()
    }
  }
}
