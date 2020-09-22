import KaTeX from 'katex'
import * as React from 'react'

import { MathEditorProps } from './editor-props'

/** @public */
export type MathRendererProps = Pick<
  MathEditorProps,
  'state' | 'inline' | 'additionalContainerProps'
>

/** @public */
export const MathRenderer = React.forwardRef<
  HTMLSpanElement,
  MathRendererProps
>(function MathRenderer({ state, inline, additionalContainerProps }, ref) {
  const html = KaTeX.renderToString(getFormula(), {
    displayMode: false,
    throwOnError: false,
  })

  return (
    <span
      ref={ref}
      dangerouslySetInnerHTML={{ __html: html }}
      style={
        inline
          ? undefined
          : {
              display: 'block',
              margin: '1em 0',
              textAlign: 'center',
            }
      }
      {...additionalContainerProps}
    />
  )

  function getFormula(): string {
    if (state === '') return '\\,'
    if (!inline) return `\\displaystyle ${state}`
    return state
  }
})
