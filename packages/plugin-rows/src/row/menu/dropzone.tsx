import * as React from 'react'
import { styled, faCloudUploadAlt, Icon } from '@edtr-io/editor-ui'

import { createRowPluginTheme } from '../..'
import { ThemeProps } from '@edtr-io/ui'

const StyledImage = styled(Icon)({
  height: '75px',
  marginBottom: '15px',
  opacity: 0.6,
  transition: '250ms all ease-in-out'
})

const StyledDropzone = styled.div(
  ({ name, ...props }: ThemeProps & { name: string }) => {
    const theme = createRowPluginTheme(name, props.theme)
    return {
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: '150px',
      width: '100%',
      backgroundColor: theme.menu.secondary.backgroundColor,
      color: theme.menu.secondary.color,
      border: `3px dashed ${theme.menu.secondary.color}`,
      transition: '250mx all ease-in-out',
      cursor: 'pointer',
      padding: '20px calc((100vw - 960px) /2)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': {
        borderColor: theme.menu.highlightColor,
        backgroundColor: theme.menu.primary.backgroundColor
      },
      [`&:hover ${StyledImage}`]: {
        opacity: 1
      },
      '@media (max-width: 1000px)': {
        padding: '20px'
      }
    }
  }
)

export const Dropzone: React.FunctionComponent<{ name: string }> = ({
  name
}) => {
  return (
    <StyledDropzone name={name}>
      <StyledImage icon={faCloudUploadAlt} size="5x" />
      <p style={{ opacity: 0.8 }}>
        Du kannst überall Dateien per Drag&#39;n&#39;Drop hinzufügen. Alternativ
        kannst du auch hier klicken...
      </p>
    </StyledDropzone>
  )
}
