import { styled, EdtrIcon, edtrTextControls } from '@edtr-io/ui'
import * as React from 'react'

import { SubControlProps, VisibleControls } from '.'
import { trimSelection } from '../helpers'
import {
  createIsColor,
  createToggleColor,
  removeColor
} from '../plugins/colors'
import { Button } from '../toolbar/button'
import { TextConfig } from '..'

export function ColorControls(props: SubControlProps) {
  const { theme } = props.config
  const { colors, defaultColor } = theme.plugins.colors
  return (
    <React.Fragment>
      <Button
        active={!createIsColor()(props.editor)}
        config={props.config}
        onClick={() => {
          removeColor(props.editor)
            .moveToEnd()
            .focus()
          props.switchControls(VisibleControls.All)
          props.onChange(props.editor)
        }}
        title="Farbe zurücksetzen"
      >
        <ColorPaletteIcon color={defaultColor} />
      </Button>

      {colors.map((color, index) => (
        <Button
          config={props.config}
          key={index}
          active={createIsColor(index)(props.editor)}
          onClick={() => {
            trimSelection(props.editor)
            createToggleColor(index)(props.editor)
              .moveToEnd()
              .focus()
            props.switchControls(VisibleControls.All)
            props.onChange(props.editor)
          }}
          title="Einfärben"
        >
          <ColorPaletteIcon color={color} />
        </Button>
      ))}
      <Button
        config={props.config}
        onClick={() => props.switchControls(VisibleControls.All)}
        title="Untermenü schließen"
      >
        <EdtrIcon icon={edtrTextControls.close} />
      </Button>
    </React.Fragment>
  )
}

const ColorPaletteIcon = styled.div<{ color: string }>(props => {
  return {
    display: 'inline-block',
    backgroundColor: props.color,
    borderRadius: ' 100%',
    width: '19px',
    height: '19px',
    margin: '3px',
    verticalAlign: 'middle'
  }
})

const ColoredText = styled.span({
  position: 'relative',
  verticalAlign: 'middle',
  display: 'inline-block'
})

const FlexContainer = styled.span({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column'
})

const Line = styled.span<{ index?: number; config: TextConfig }>(props => {
  const { theme } = props.config
  const { colors, defaultColor } = theme.plugins.colors
  return {
    border: `2px solid ${
      props.index === undefined
        ? defaultColor
        : colors[props.index % colors.length]
    }`,
    borderRadius: '4px',
    bottom: '0',
    width: '80%',
    position: 'absolute'
  }
})
export function ColoredTextIcon(props: { index?: number; config: TextConfig }) {
  return (
    <ColoredText>
      <FlexContainer>
        <EdtrIcon icon={edtrTextControls.colorText} />
        <Line config={props.config} index={props.index} />
      </FlexContainer>
    </ColoredText>
  )
}
