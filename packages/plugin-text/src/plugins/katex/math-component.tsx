import KaTeX from 'katex'
import * as React from 'react'

const createMathComponent = (
  Component: React.ComponentType<InnerMathProps>,
  { displayMode }: { displayMode: boolean }
) => {
  interface MathComponentProps {
    math: string
    errorColor?: string
    renderError: (error: KaTeX.ParseError) => React.ReactNode
    innerRef: React.Ref<HTMLElement>
  }

  interface MathComponentState {
    html: string
    error?: KaTeX.ParseError
  }

  class MathComponent extends React.Component<
    MathComponentProps,
    MathComponentState
  > {
    public state: MathComponentState = { html: '' }

    public render() {
      const { error, html } = this.state
      const { renderError, innerRef } = this.props

      if (error) {
        return renderError ? (
          renderError(error)
        ) : (
          <Component html={`${error.message}`} innerRef={innerRef} />
        )
      }

      return <Component html={html} innerRef={innerRef} />
    }

    public shouldComponentUpdate(nextProps: MathComponentProps) {
      return nextProps.math !== this.props.math
    }

    public static getDerivedStateFromProps(
      props: MathComponentProps
    ): Partial<MathComponentState> {
      try {
        const { errorColor, renderError } = props

        const html = KaTeX.renderToString(props.math, {
          displayMode,
          errorColor,
          throwOnError: !!renderError
        })

        return { html, error: undefined }
      } catch (error) {
        if (error instanceof KaTeX.ParseError) {
          return { error }
        }

        throw error
      }
    }
  }

  return MathComponent
}

interface InnerMathProps {
  html: string
  innerRef: React.Ref<HTMLElement>
}

const IBlockMath = (props: InnerMathProps) => {
  return (
    <span
      style={{ display: 'block' }}
      ref={props.innerRef}
      dangerouslySetInnerHTML={{ __html: props.html }}
    />
  )
}

const BlockMath = createMathComponent(IBlockMath, { displayMode: true })

const IInlineMath = (props: InnerMathProps) => {
  return (
    <span
      ref={props.innerRef}
      dangerouslySetInnerHTML={{ __html: props.html }}
    />
  )
}

const InlineMath = createMathComponent(IInlineMath, {
  displayMode: false
})

const handleError = (
  formula: string,
  error: KaTeX.ParseError,
  inline: boolean,
  oldErrorPosition?: number
) => {
  const errorStyle = {
    color: '#CC0000'
  }

  if (error.position === oldErrorPosition) {
    return <span style={errorStyle}>{formula}</span>
  }

  const beforeError = formula.substring(0, error.position)
  const afterError = formula.substring(error.position)
  return (
    <span
      style={{
        display: 'inline-block'
      }}
    >
      <Math
        formula={beforeError}
        inline={inline}
        oldErrorPosition={error.position}
      />
      <span style={errorStyle}>{afterError}</span>
      <span style={{ ...errorStyle, display: 'block' }}>
        <b>
          {error.name}: {error.message}
        </b>
      </span>
    </span>
  )
}

export class Math extends React.Component<MathProps> {
  public render() {
    const { inline, formula, oldErrorPosition, innerRef } = this.props

    if (!formula) {
      return null
    }

    const Component = inline ? InlineMath : BlockMath

    return (
      <Component
        math={formula}
        innerRef={innerRef as React.Ref<HTMLElement>}
        renderError={error =>
          handleError(formula, error, !inline, oldErrorPosition)
        }
      />
    )
  }
}

export interface MathProps {
  formula?: string
  inline?: boolean
  oldErrorPosition?: number
  innerRef?: React.Ref<HTMLElement>
}
