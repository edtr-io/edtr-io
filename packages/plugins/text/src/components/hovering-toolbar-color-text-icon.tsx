import { edtrColorText, EdtrIcon, styled } from '@edtr-io/ui'
import React from 'react'

import { ColorsTheme } from '../types'

interface HoveringToolbarColorTextIconProps {
  index?: number
  colorsTheme: ColorsTheme
}

const ColoredText = styled.span({
  position: 'relative',
  verticalAlign: 'middle',
  display: 'inline-block',
})

const FlexContainer = styled.span({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
})

const Line = styled.span<HoveringToolbarColorTextIconProps>(
  ({ index, colorsTheme }) => ({
    border: `2px solid ${
      index === undefined
        ? colorsTheme.defaultColor
        : colorsTheme.colors[index % colorsTheme.colors.length]
    }`,
    borderRadius: '4px',
    bottom: '0',
    width: '80%',
    position: 'absolute',
  })
)

export const HoveringToolbarColorTextIcon = ({
  index,
  colorsTheme,
}: HoveringToolbarColorTextIconProps) => (
  <ColoredText>
    <FlexContainer>
      <EdtrIcon icon={edtrColorText} />
      <Line colorsTheme={colorsTheme} index={index} />
    </FlexContainer>
  </ColoredText>
)
