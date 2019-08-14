import { styled, createPluginTheme, ThemeProps } from '@edtr-io/ui'
import * as React from 'react'

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

export class Suggestions extends React.Component<SuggestionProps> {
  public render() {
    return (
      <Container>
        {this.props.options.length === 0
          ? 'keine Einträge vorhanden'
          : this.props.options.map((option, index) => {
              const displayText = option[0]
              const fragments = displayText
                .split(
                  new RegExp(`(${escapeRegExp(this.props.currentValue)})`, 'i')
                )
                .map(text => {
                  return {
                    text,
                    highlight:
                      text.toLowerCase() ===
                      this.props.currentValue.toLowerCase()
                  }
                })

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

    function escapeRegExp(string: string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }
  }
}

interface SuggestionTheme {
  background: { default: string; highlight: string }

  text: { default: string; highlight: string }
}

export interface SuggestionProps {
  onSelect: Function
  options: string[][]
  selected?: number
  currentValue: string
  name: string
}
