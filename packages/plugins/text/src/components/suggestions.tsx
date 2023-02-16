import { styled } from '@edtr-io/ui'
import React from 'react'

import { TextPluginConfig } from '..'

export interface SuggestionProps {
  options: string[][]
  config: TextPluginConfig
  currentValue: string
  selected?: number
  onSelect: (option: string) => void
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const Suggestion = styled.div<{ isActive: boolean }>(({ isActive, theme }) => ({
  height: '32px',
  padding: '4px 8px',
  cursor: 'pointer',
  backgroundColor: isActive
    ? theme.suggestions.background.highlight
    : theme.suggestions.background.default,
  borderRadius: '4px',
  '&:hover': {
    background: theme.suggestions.background.highlight,
  },
}))

const Container = styled.div({
  padding: '10px',
})

const StyledText = styled.span<{ isHighlighted: boolean }>(
  ({ isHighlighted, theme }) => ({
    color: isHighlighted
      ? theme.suggestions.text.highlight
      : theme.suggestions.text.default,
  })
)

export function Suggestions(props: SuggestionProps) {
  const { options, config, currentValue, selected, onSelect } = props
  const { i18n, theme } = config

  if (options.length === 0) {
    return <Container>{i18n.suggestions.noResultsMessage}</Container>
  }

  return (
    <Container>
      {options.map((option, index) => {
        const displayText = option[0]
        const fragments = displayText
          .split(new RegExp(`(${escapeRegExp(currentValue)})`, 'i'))
          .map((text) => ({
            text,
            isHighlighted: text.toLowerCase() === currentValue.toLowerCase(),
          }))

        return (
          <Suggestion
            key={index}
            isActive={index === selected}
            onMouseDown={() => onSelect(option[1])}
            theme={theme}
          >
            {fragments.map((fragment, fragmentIndex) => (
              <StyledText
                key={fragmentIndex}
                isHighlighted={fragment.isHighlighted}
                theme={theme}
              >
                {fragment.text}
              </StyledText>
            ))}
          </Suggestion>
        )
      })}
    </Container>
  )
}
