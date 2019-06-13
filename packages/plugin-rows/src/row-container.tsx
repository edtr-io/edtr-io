import { styled } from '@edtr-io/editor-ui'
import { ThemeProps } from '@edtr-io/ui'

import { createRowPluginTheme } from '.'

export const RowContainer = styled.div<{
  isFirst?: boolean
  name: string
  noHeight?: boolean
  expanded?: boolean
}>(
  ({
    isFirst,
    name,
    noHeight,
    expanded,
    ...props
  }: {
    isFirst?: boolean
    name: string
    noHeight?: boolean
    expanded?: boolean
  } & ThemeProps) => {
    const theme = createRowPluginTheme(name, props.theme)
    return {
      marginLeft: expanded ? '25px' : 0,
      ...(!noHeight
        ? {
            minHeight: '10px',
            marginBottom: '25px',
            marginTop: isFirst ? '25px' : '0px'
          }
        : {}),

      position: 'relative',
      borderLeft: '2px solid transparent',
      transition: '250ms all ease-in-out',
      paddingLeft: expanded ? '25px' : 0,
      ...(expanded
        ? {
            borderColor: theme.color,
            paddingTop: 0,
            paddingBottom: 0
          }
        : {})
    }
  }
)
