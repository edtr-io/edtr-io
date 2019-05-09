import * as React from 'react'
import { SubControlProps, VisibleControls } from './index'
import { Button } from '../toolbar/button'
import {
  createIsColor,
  createToggleColor,
  removeColor
} from '../plugins/colors'
import { styled, ThemeProps, usePluginTheme } from '@edtr-io/ui'
import {
  createTextPluginTheme,
  textPluginThemeFactory,
  trimSelection
} from '@edtr-io/plugin-text'
import { EdtrIcon, edtrTextControls } from '@edtr-io/editor-ui'

export const ColorControls: React.FunctionComponent<
  SubControlProps
> = props => {
  const theme = usePluginTheme(props.name, textPluginThemeFactory)
  const { colors, defaultColor } = theme.plugins.colors
  return (
    <React.Fragment>
      <Button
        active={!createIsColor()(props.editor)}
        name={props.name}
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
          key={index}
          active={createIsColor(index)(props.editor)}
          name={props.name}
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
        name={props.name}
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

const Line = styled.span<{ index?: number }>(
  (props: ThemeProps & { index?: number }) => {
    const theme = createTextPluginTheme(name, props.theme)
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
  }
)
export const ColoredTextIcon: React.FunctionComponent<{
  index?: number
}> = props => {
  return (
    <ColoredText>
      <FlexContainer>
        <EdtrIcon icon={edtrTextControls.colorText} />
        <Line index={props.index} />
      </FlexContainer>
    </ColoredText>
  )
}
