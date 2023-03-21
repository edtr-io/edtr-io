import { PreferenceContext } from '@edtr-io/core/beta'
import { MathEditor } from '@edtr-io/math'
import React, { useContext } from 'react'
import { Range, Transforms } from 'slate'
import {
  ReactEditor,
  RenderElementProps,
  useSlate,
  useSelected,
} from 'slate-react'

import type { MathElement as MathElementType } from '../types'
import { MathFormula } from './math-formula'

export interface MathElementProps {
  element: MathElementType
  attributes: RenderElementProps['attributes']
  children: RenderElementProps['children']
}

const visualEditorPreferenceKey = 'text:math:visual-editor'

export function MathElement({
  element,
  attributes,
  children,
}: MathElementProps) {
  const editor = useSlate()
  const selected = useSelected()
  const preferences = useContext(PreferenceContext)

  const shouldShowMathEditor =
    selected && editor.selection && Range.isCollapsed(editor.selection)

  if (!shouldShowMathEditor) {
    return (
      <span {...attributes}>
        <MathFormula element={element} />
        {children}
      </span>
    )
  }

  const isVisualMode = !!preferences.getKey(visualEditorPreferenceKey)

  function updateElement(update: Partial<MathElementType>) {
    const path = ReactEditor.findPath(editor, element)

    Transforms.setNodes(editor, update, { at: path })
  }

  function transformOutOfElement({
    reverse = false,
    shouldDelete = false,
  }: {
    reverse?: boolean
    shouldDelete?: boolean
  } = {}) {
    const unit = 'character'

    Transforms.move(editor, { unit, reverse })

    if (shouldDelete) {
      Transforms.delete(editor, { unit, reverse })
    }

    ReactEditor.focus(editor)
  }

  /* TODO: We need to define
    export interface MathEditorProps {
      config: DeepPartial<MathEditorConfig>
    }
  */
  return (
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
        onMoveOutRight={transformOutOfElement}
        onMoveOutLeft={() => {
          transformOutOfElement({ reverse: true })
        }}
        onDeleteOutRight={() => {
          transformOutOfElement({ shouldDelete: true })
        }}
        onDeleteOutLeft={() => {
          transformOutOfElement({ shouldDelete: true, reverse: true })
        }}
        config={{}}
        onEditorChange={(visual) =>
          preferences.setKey(visualEditorPreferenceKey, visual)
        }
      />
      {children}
    </span>
  )
}
