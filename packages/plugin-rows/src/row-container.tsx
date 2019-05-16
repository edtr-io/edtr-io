import { styled } from '@edtr-io/editor-ui'
import { ThemeProps } from '@edtr-io/ui'

import { createRowPluginTheme } from './index'

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
      marginLeft: '25px',
      marginRight: '25px',
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
      paddingLeft: '25px',
      paddingRight: '25px',
      // '&:hover': {
      //   borderColor: editable ? theme.backgroundColor : 'transparent'
      // },
      //
      // '&:hover .row-controls': {
      //   opacity: 1
      // }
      ...(expanded
        ? {
            borderColor: theme.backgroundColor,
            paddingTop: 0,
            paddingBottom: 0
          }
        : {})
    }
  }
)
