import KaTeX from 'katex'
import * as React from 'react'

export interface MathProps {
  formula: string
  inline?: boolean
  innerRef?: React.Ref<HTMLElement>
}

export const Math = (props: MathProps) => {
  const { inline, innerRef } = props
  let formula = props.formula

  // make empty formulas clickable
  if (!formula) {
    formula = '\\,'
  }
  // use displaystyle for block formulas
  if (!inline) {
    formula = '\\displaystyle ' + formula
  }

  const html = KaTeX.renderToString(formula, {
    displayMode: false,
    throwOnError: false
  })

  if (inline) {
    return <span ref={innerRef} dangerouslySetInnerHTML={{ __html: html }} />
  } else {
    return (
      <span
        style={{ display: 'block', margin: '1em 0', textAlign: 'center' }}
        ref={props.innerRef}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }
}
