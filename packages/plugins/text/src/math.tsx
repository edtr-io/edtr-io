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
  inline: string
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
  autofocus?: boolean
  state: string
  inline?: boolean
  readOnly?: boolean
  visual?: boolean
  disableBlock?: boolean
  config: DeepPartial<MathEditorConfig>
  additionalContainerProps?: Record<string, unknown>
  onBlur?(): void
  onEditorChange(visual: boolean): void
  onInlineChange?(inline: boolean): void
  onChange(state: string): void
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
        inline={element.inline === 'true'}
        readOnly={false}
        visual={isVisualMode}
        disableBlock={false}
        onInlineChange={(inline) => {
          updateElement({ inline: inline.toString() })
        }}
        onChange={(src) => updateElement({ src })}
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
