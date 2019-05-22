import * as React from 'react'
import { styled, createPluginTheme, ThemeProps } from '@edtr-io/ui'

const createSuggestionsTheme = createPluginTheme<SuggestionTheme>(theme => {
  return {
    background: {
      default: 'transparent',
      highlight: theme.editor.primary.background
    },

    text: {
      default: theme.editor.color,
      highlight: theme.editor.danger.background
    }
  }
})

const Suggestion = styled.div<{ active: boolean; name: string }>(
  ({
    active,
    name,
    ...props
  }: { active: boolean; name: string } & ThemeProps) => {
    const theme = createSuggestionsTheme(name, props.theme)
    return {
      height: '32px',
      padding: '4px 8px',
      cursor: 'pointer',
      backgroundColor: active
        ? theme.background.highlight
        : theme.background.default,
      borderRadius: '4px',
      '&:hover': {
        background: theme.background.highlight
      }
    }
  }
)

const Container = styled.div({
  padding: '10px'
})

const StyledText = styled.span<{ highlight: boolean; name: string }>(
  ({
    highlight,
    name,
    ...props
  }: { highlight: boolean; name: string } & ThemeProps) => {
    const theme = createSuggestionsTheme(name, props.theme)
    return {
      color: highlight ? theme.text.highlight : theme.text.default
    }
  }
)

/**
 * Suggestions is a PureComponent because we need to prevent updates when x/ y
 * Are just going to be the same value. Otherwise we will update forever.
 */

export class Suggestions extends React.Component<SuggestionProps> {
  /**
   * On update, update the menu.
   */

  public render() {
    return (
      <Container>
        {this.props.options.length === 0
          ? 'keine Einträge vorhanden'
          : this.props.options.map((option, index) => {
              let fragments: Fragment[] = []
              let text = option[0]
              while (text.length > this.props.currentValue.length) {
                const i = text
                  .toLowerCase()
                  .indexOf(this.props.currentValue.toLowerCase())
                if (i === -1 || !this.props.currentValue.length) {
                  fragments.push({ text: text, highlight: false })
                  break
                }
                const before = text.slice(0, i)
                const match = text.slice(i, i + this.props.currentValue.length)
                fragments.push(
                  { text: before, highlight: false },
                  { text: match, highlight: true }
                )
                const after = text.slice(i + this.props.currentValue.length)
                text = after
              }
              return (
                <Suggestion
                  key={index}
                  active={index === this.props.selected}
                  onClick={() => this.props.onSelect(option[1])}
                  name={this.props.name}
                >
                  {fragments.map((f, index) => {
                    return (
                      <StyledText
                        key={index}
                        highlight={f.highlight}
                        name={this.props.name}
                      >
                        {f.text}
                      </StyledText>
                    )
                  })}
                </Suggestion>
              )
            })}
      </Container>
    )
  }
}

interface SuggestionTheme {
  background: { default: string; highlight: string }

  text: { default: string; highlight: string }
}

interface SuggestionProps {
  onSelect: Function
  options: string[][]
  selected?: number
  currentValue: string
  name: string
}

interface Fragment {
  text: string
  highlight: boolean
}
