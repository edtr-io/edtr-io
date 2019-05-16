import * as React from 'react'
import { styled, faCloudUploadAlt, Icon } from '@edtr-io/editor-ui'
import { ThemeProps } from '@edtr-io/ui'

import { createRowPluginTheme } from '../..'

const StyledImage = styled(Icon)({
  height: '48px',
  marginBottom: '15px',
  opacity: 0.8,
  transition: '250ms all ease-in-out'
})

const StyledDropzone = styled.div(
  ({ name, ...props }: ThemeProps & { name: string }) => {
    const theme = createRowPluginTheme(name, props.theme)
    return {
      width: '100%',
      backgroundColor: theme.menu.secondary.backgroundColor,
      color: theme.menu.secondary.color,
      border: `3px dashed ${theme.menu.secondary.color}`,
      transition: '250mx all ease-in-out',
      borderRadius: '5px',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '10px',
      paddingBottom: '10px',

      '&:hover': {
        borderColor: theme.menu.highlightColor,
        backgroundColor: theme.menu.primary.backgroundColor
      },
      [`&:hover ${StyledImage}`]: {
        opacity: 1
      },
      '@media (max-width: 1000px)': {
        padding: '10px 20px'
      },
      '@media (min-width: 1000px)': {
        width: '85%'
      }
    }
  }
)

const Caption = styled.p(
  ({ name, ...props }: ThemeProps & { name: string }) => {
    const theme = createRowPluginTheme(name, props.theme)
    return {
      marginBottom: '0',
      opacity: 0.8,
      color: theme.menu.secondary.color,
      textAlign: 'center',
      maxWidth: '600px',
      fontFamily: '"PT Sans Narrow", sans-serif',
      fontWeight: 'bold'
    }
  }
)

export const Dropzone: React.FunctionComponent<{ name: string }> = ({
  name
}) => {
  return (
    <StyledDropzone name={name}>
      <StyledImage icon={faCloudUploadAlt} size="5x" />
      <Caption name={name}>
        Du kannst überall Dateien per Drag&#39;n&#39;Drop hinzufügen. Alternativ
        kannst du auch hier klicken...
      </Caption>
    </StyledDropzone>
  )
}
