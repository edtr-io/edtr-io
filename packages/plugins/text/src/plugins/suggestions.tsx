import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { TextConfig } from '..'

const Suggestion = styled.div<{ active: boolean; config: TextConfig }>(
  ({ active, config }) => {
    const { theme } = config
    return {
      height: '32px',
      padding: '4px 8px',
      cursor: 'pointer',
      backgroundColor: active
        ? theme.suggestions.background.highlight
        : theme.suggestions.background.default,
      borderRadius: '4px',
      '&:hover': {
        background: theme.suggestions.background.highlight
      }
    }
  }
)

const Container = styled.div({
  padding: '10px'
})

const StyledText = styled.span<{ highlight: boolean; config: TextConfig }>(
  ({ highlight, config }) => {
    const { theme } = config
    return {
      color: highlight
        ? theme.suggestions.text.highlight
        : theme.suggestions.text.default
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
                  onMouseDown={() => this.props.onSelect(option[1])}
                  config={this.props.config}
                >
                  {fragments.map((f, index) => {
                    return (
                      <StyledText
                        key={index}
                        highlight={f.highlight}
                        config={this.props.config}
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

export interface SuggestionProps {
  config: TextConfig
  onSelect: Function
  options: string[][]
  selected?: number
  currentValue: string
  name: string
}
