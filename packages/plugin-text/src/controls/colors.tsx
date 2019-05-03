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
import { Icon, faTimes } from '@edtr-io/editor-ui'

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
        <Icon icon={faTimes} />
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

const Line = styled.span<{ index?: number }>(
  (props: ThemeProps & { index?: number }) => {
    const theme = createTextPluginTheme(name, props.theme)
    const { colors, defaultColor } = theme.plugins.colors
    return {
      width: '80%',
      border: `2px solid ${
        props.index === undefined
          ? defaultColor
          : colors[props.index % colors.length]
      }`,
      borderRadius: '4px',
      marginTop: '-0.15em'
    }
  }
)
const ColoredText = styled.span((props: ThemeProps) => {
  const theme = createTextPluginTheme(name, props.theme)
  return {
    color: theme.color,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
})

export const ColoredTextIcon: React.FunctionComponent<{
  index?: number
}> = props => {
  return (
    <ColoredText>
      A
      <Line index={props.index} />
    </ColoredText>
  )
}
