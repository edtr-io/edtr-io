import { styled } from '@edtr-io/ui'
import KaTeX from 'katex'
import * as React from 'react'

import { MathElement } from './types'

const KaTeXSpan = styled.span<{ element: MathElement }>(({ element }) => {
  if (!element.inline) {
    return {
      display: 'block',
      margin: '1em 0',
      textAlign: 'center'
    }
  }
})

export function Math({ element }: { element: MathElement }) {
  const { inline, src } = element
  console.log(element)

  const html = KaTeX.renderToString(
    `${inline ? '' : '\\displaystyle '}${src}`,
    {
      displayMode: false,
      throwOnError: false
    }
  )

  return (
    <KaTeXSpan dangerouslySetInnerHTML={{ __html: html }} element={element} />
  )
}
