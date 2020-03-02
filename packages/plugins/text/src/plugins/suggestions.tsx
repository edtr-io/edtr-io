import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { TextPluginConfig } from '..'
import { I18nContext } from '../i18n-context'

const Suggestion = styled.div<{ active: boolean; config: TextPluginConfig }>(
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

const StyledText = styled.span<{
  highlight: boolean
  config: TextPluginConfig
}>(({ highlight, config }) => {
  const { theme } = config
  return {
    color: highlight
      ? theme.suggestions.text.highlight
      : theme.suggestions.text.default
  }
})

export function Suggestions(props: SuggestionProps) {
  const i18n = React.useContext(I18nContext)
  return (
    <Container>
      {props.options.length === 0
        ? i18n.suggestions.noResultsMessage
        : props.options.map((option, index) => {
            const displayText = option[0]
            const fragments = displayText
              .split(new RegExp(`(${escapeRegExp(props.currentValue)})`, 'i'))
              .map(text => {
                return {
                  text,
                  highlight:
                    text.toLowerCase() === props.currentValue.toLowerCase()
                }
              })

            return (
              <Suggestion
                key={index}
                active={index === props.selected}
                onMouseDown={() => props.onSelect(option[1])}
                config={props.config}
              >
                {fragments.map((f, index) => {
                  return (
                    <StyledText
                      key={index}
                      highlight={f.highlight}
                      config={props.config}
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

export interface SuggestionProps {
  config: TextPluginConfig
  onSelect: Function
  options: string[][]
  selected?: number
  currentValue: string
}
