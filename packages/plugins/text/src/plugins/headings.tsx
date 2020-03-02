import * as R from 'ramda'
import * as React from 'react'
import { Editor } from 'slate-react'

import { BlockEditorProps, BlockRendererProps, TextPlugin } from '..'
import { HeadingLevel, createHeadingNode } from '../model'

export interface HeadingsPluginOptions {
  EditorComponent?: React.ComponentType<
    BlockEditorProps & { level: HeadingLevel }
  >
  RenderComponent?: React.ComponentType<
    BlockRendererProps & { level: HeadingLevel }
  >
}

const Heading = React.forwardRef(
  (
    {
      level,
      children,
      ...props
    }: {
      level: number
      children: React.ReactNode
    },
    ref
  ) => {
    const headingLevel = level <= 6 && level >= 1 ? level : 6
    return React.createElement(`h${headingLevel}`, { ...props, ref }, children)
  }
)
Heading.displayName = 'Heading'

class DefaultEditorComponent extends React.Component<
  BlockEditorProps & { level: HeadingLevel }
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
  EditorComponent = DefaultEditorComponent
}: HeadingsPluginOptions = {}) => (): TextPlugin => {
  return {
    renderBlock(props, _editor, next) {
      const block = props.node

      const match = /@splish-me\/h([1-6])/.exec(block.type)

      if (match) {
        const level = parseInt(match[1], 10) as HeadingLevel

        return <EditorComponent level={level} {...props} />
      }

      return next()
    }
  }
}
