import KaTeX from 'katex'
import * as React from 'react'

const createMathComponent = (Component, { displayMode }) => {
  interface MathComponentProps {
    math: string
    errorColor?: string
    renderError: (error: Error) => React.ReactNode
  }

  interface MathComponentState {
    html: string
    error?: Error
  }

  class MathComponent extends React.Component<
    MathComponentProps,
    MathComponentState
  > {
    public state: MathComponentState = { html: '' }

    public render() {
      const { error, html } = this.state
      const { renderError } = this.props

      if (error) {
        return renderError ? (
          renderError(error)
        ) : (
          <Component html={`${error.message}`} />
        )
      }

      return <Component html={html} />
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
        if (error instanceof KaTeX.ParseError || error instanceof TypeError) {
          return { error }
        }

        throw error
      }
    }
  }

  return MathComponent
}

const IBlockMath = ({ html }: { html: string }) => {
  return (
    <span
      style={{ display: 'block' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

const BlockMath = createMathComponent(IBlockMath, { displayMode: true })

const IInlineMath = ({ html }: { html: string }) => {
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

const InlineMath = createMathComponent(IInlineMath, {
  displayMode: false
})

const handleError = (formula, error, inline, oldErrorPosition) => {
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
    const { inline, formula, oldErrorPosition } = this.props

    if (!formula) {
      return null
    }

    const Component = inline ? InlineMath : BlockMath

    return (
      <Component
        math={formula}
        renderError={error =>
          handleError(formula, error, inline, oldErrorPosition)
        }
      />
    )
  }
}

export interface MathProps {
  formula?: string
  inline?: boolean
  oldErrorPosition?: unknown
}
