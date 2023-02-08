import { PreferenceContext } from '@edtr-io/core'
import { MathEditor } from '@edtr-io/math'
import { styled } from '@edtr-io/ui'
import KaTeX from 'katex'
import React, { useContext } from 'react'
import { Range, Transforms } from 'slate'
import {
  RenderElementProps,
  useSlate,
  useSelected,
  ReactEditor,
} from 'slate-react'

// TODO: Good structure
export interface MathElement {
  type: 'math'
  src: string
  inline: boolean
  children: []
}

const preferenceKey = 'text:math:visual-editor'
const KaTeXSpan = styled.span<{ element: MathElement }>(({ element }) => {
  if (!element.inline) {
    return {
      display: 'block',
      margin: '1em 0',
      textAlign: 'center',
    }
  }
})

export function MathElement({
  element,
  attributes,
  children,
}: {
  element: MathElement
  attributes: RenderElementProps['attributes']
  children: RenderElementProps['children']
}) {
  const editor = useSlate()
  const selected = useSelected()
  const preferences = useContext(PreferenceContext)

  const showMathEditor =
    selected && editor.selection && Range.isCollapsed(editor.selection)
  const isVisualMode = !!preferences.getKey(preferenceKey)

  /* TODO: We need to define
export interface MathEditorProps {
  
  config: DeepPartial<MathEditorConfig>
  onMoveOutRight?(): void
  onMoveOutLeft?(): void
  onDeleteOutRight?(): void
  onDeleteOutLeft?(): void
}*/

  function updateElement(update: Partial<MathElement>) {
    const path = ReactEditor.findPath(editor, element)
    Transforms.setNodes(editor, update, { at: path })
  }

  return showMathEditor ? (
    <span {...attributes} tabIndex={-1}>
      <MathEditor
        autofocus
        state={element.src}
        inline={element.inline}
        readOnly={false}
        visual={isVisualMode}
        disableBlock={false}
        onInlineChange={(inline) => {
          updateElement({ inline })
        }}
        onChange={(src) => updateElement({ src })}
        onMoveOutRight={() => {
          Transforms.move(editor, { unit: 'offset' })
          ReactEditor.focus(editor)
        }}
        onMoveOutLeft={() => {
          Transforms.move(editor, { unit: 'offset', reverse: true })
          ReactEditor.focus(editor)
        }}
        config={{}}
        onEditorChange={(isVisualMode) =>
          preferences.setKey(preferenceKey, isVisualMode)
        }
      />
      {children}
    </span>
  ) : (
    <span {...attributes}>
      <MathFormula element={element} />
      {children}
    </span>
  )
}

function MathFormula({ element }: { element: MathElement }) {
  const html = KaTeX.renderToString(
    `${element.inline ? '' : '\\displaystyle '}${element.src}`,
    {
      displayMode: false,
      throwOnError: false,
    }
  )

  return (
    <KaTeXSpan dangerouslySetInnerHTML={{ __html: html }} element={element} />
  )
}
