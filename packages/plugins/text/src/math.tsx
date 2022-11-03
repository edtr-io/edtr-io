import { PreferenceContext } from '@edtr-io/core'
import { MathEditor } from '@edtr-io/math'
import { styled } from '@edtr-io/ui'
import KaTeX from 'katex'

// TODO: Linter rules updaten
import React, { useState, useContext } from 'react'
import { RenderElementProps } from 'slate-react'

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
  const preferences = useContext(PreferenceContext)
  // TODO
  const visualEditor = true
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

  return visualEditor ? (
    <span {...attributes}>
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
