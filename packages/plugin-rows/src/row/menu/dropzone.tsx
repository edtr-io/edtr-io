import * as React from 'react'
import { styled } from '@edtr-io/ui'

const StyledDropzone = styled.div({
  position: 'absolute',
  bottom: 0,
  left: 0,
  height: '200px',
  width: '100%',
  backgroundColor: 'rgb(245,245,245)',
  border: '3px dashed rgba(0, 0, 0, 0.4)',
  transition: '250mx all ease-in-out',
  cursor: 'pointer',
  padding: '0 calc((100vw - 960px) /2)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    borderColor: 'rgb(177, 4, 56)',
    backgroundColor: 'rgb(250,250,250)'
  },
  '&:hover img': {
    opacity: 1
  },
  '@media (max-width: 1000px)': {
    padding: '0 20px'
  }
})

const StyledImage = styled.img({
  height: '75px',
  marginBottom: '15px',
  opacity: 0.6,
  transition: '250ms all ease-in-out'
})

export const Dropzone = () => {
  return (
    <StyledDropzone>
      <StyledImage src={require('../../../assets/upload.svg')} />
      <p style={{ opacity: 0.8 }}>
        Du kannst überall Dateien per Drag&#39;n&#39;Drop hinzufügen. Alternativ
        kannst du auch hier klicken...
      </p>
    </StyledDropzone>
  )
}
