import { MathEditor } from '@edtr-io/math'
import { styled } from '@edtr-io/ui'
import KaTeX from 'katex'
import React, { useState } from 'react'
import { RenderElementProps } from 'slate-react'

// TODO: Good structure
export interface MathElement {
  type: 'math'
  src: string
  inline: boolean
  children: []
}

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
}: {
  element: MathElement
  attributes: RenderElementProps['attributes']
}) {
  // TODO
  const visualEditor = true
  // TODO How to define whether it shall be in visual mode first?
  const [isVisualMode, setIsVisualMode] = useState(false)

  // TODO: Extra component
  const html = KaTeX.renderToString(
    `${element.inline ? '' : '\\displaystyle '}${element.src}`,
    {
      displayMode: false,
      throwOnError: false,
    }
  )

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

  return visualEditor ? (
    <MathEditor
      autofocus
      state={element.src}
      inline={element.inline}
      readOnly={false}
      visual={isVisualMode}
      disableBlock={false}
      onInlineChange={(inline) => console.log(inline)}
      onChange={(formula) => console.log(formula)}
      config={{}}
      onEditorChange={setIsVisualMode}
      additionalContainerProps={attributes}
    />
  ) : (
    <KaTeXSpan
      dangerouslySetInnerHTML={{ __html: html }}
      element={element}
      {...attributes}
    />
  )
}
