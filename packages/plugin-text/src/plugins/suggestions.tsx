import * as React from 'react'
import { styled } from '@edtr-io/ui'

const Suggestion = styled.div<{ active: boolean }>(props => {
  return {
    height: '32px',
    padding: '4px 8px',
    cursor: 'pointer',
    backgroundColor: props.active ? '#87cefa' : 'transparent',
    borderRadius: '4px',
    '&:hover': {
      background: '#87cefa'
    }
  }
})

const Container = styled.div({
  padding: '10px'
})

/**
 * Suggestions is a PureComponent because we need to prevent updates when x/ y
 * Are just going to be the same value. Otherwise we will update forever.
 */

class Suggestions extends React.Component<SuggestionProps> {
  /**
   * On update, update the menu.
   */

  public render() {
    return (
      <Container>
        {this.props.options.length === 0
          ? 'keine Einträge vorhanden'
          : this.props.options.map((option, index) => {
              return (
                <Suggestion
                  key={index}
                  active={index === this.props.selected}
                  onClick={() => this.props.onSelect(option[1])}
                >
                  {option[0]}
                </Suggestion>
              )
            })}
      </Container>
    )
  }
}

interface SuggestionProps {
  onSelect: Function
  options: string[][]
  selected?: number
}

export default Suggestions
