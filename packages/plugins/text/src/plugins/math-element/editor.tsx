import { PreferenceContext } from '@edtr-io/core'
import { styled } from '@edtr-io/ui'
import * as React from 'react'
import { Range, Transforms } from 'slate'
import {
  ReactEditor,
  RenderElementProps,
  useFocused,
  useSelected
} from 'slate-react'

import { useEditor } from '../../helpers'
import { Math } from './renderer'
import { MathElement } from './types'
import { VisualEditor } from './visual-editor'

const preferenceKey = 'text:math:visual-editor'

const Placeholder = styled.span({
  backgroundColor: 'lightgrey'
})

const VisualEditorWrapper = styled.span<{ element: MathElement }>(
  ({ element }) => {
    return {
      whiteSpace: undefined,
      overflowWrap: undefined,
      ...(element.inline
        ? {
            display: 'inline-block'
          }
        : {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '0.9em',
            marginBottom: '0.9em'
          })
    }
  }
)

export function MathEditor({
  attributes,
  children,
  element
}: RenderElementProps & { element: MathElement }) {
  const editor = useEditor()
  const focused = useFocused()
  const selected = useSelected()

  const preferences = React.useContext(PreferenceContext)
  const [hasError, setError] = React.useState(false)
  // FIXME:
  const visualEditor = false && preferences.getKey(preferenceKey) && !hasError

  return renderChildren()

  function renderChildren() {
    const { selection } = editor
    if (focused && selected && selection && Range.isCollapsed(selection)) {
      return (
        <React.Fragment>
          {visualEditor ? (
            <VisualEditorWrapper {...attributes} element={element}>
              <VisualEditor
                element={element}
                onChange={element => {
                  setSrc(element.src)
                }}
                onError={() => {
                  setError(true)
                }}
              />
              {children}
            </VisualEditorWrapper>
          ) : (
            <span {...attributes}>
              <Math element={element} />
              {children}
            </span>
          )}
        </React.Fragment>
      )
    }

    return (
      <span {...attributes}>
        {element.src ? (
          <Math element={element} />
        ) : (
          <Placeholder>[neue Formel]</Placeholder>
        )}
        {children}
      </span>
    )
  }

  function setSrc(src: string) {
    const path = ReactEditor.findPath(editor, element)
    Transforms.setNodes(editor, { src }, { at: path })
  }
}
