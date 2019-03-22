import styled from 'styled-components'

export { styled }

export interface Theming {
  highlightColor: string
  textColor: string
  backgroundColor: string
  buttonBackgroundColor: string
}

export const defaultTheming: Theming = {
  highlightColor: 'rgb(70, 155, 255)',
  textColor: '#EEEEEE',
  backgroundColor: 'rgb(51,51,51,0.95)',
  buttonBackgroundColor: 'transparent'
}
