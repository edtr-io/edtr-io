import {
  EdtrIcon,
  edtrBold,
  edtrItalic,
  styled,
  edtrColorText
} from '@edtr-io/ui'
import * as React from 'react'

import { TextEditorPlugin } from '../types'
import { createColorMarkPlugin } from './color-mark'
import { createEmMarkPlugin } from './em-mark'
import { createHoveringToolbarPlugin } from './hovering-toolbar'
import { createParagraphElementPlugin } from './paragraph-element'
import { createStrongMarkPlugin } from './strong-mark'

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

const Line = styled.span<{ color: string }>(({ color }) => {
  return {
    border: `2px solid ${color}`,
    borderRadius: '4px',
    bottom: '0',
    width: '80%',
    position: 'absolute'
  }
})

function ColoredTextIcon(props: { color: string }) {
  return (
    <ColoredText>
      <FlexContainer>
        <EdtrIcon icon={edtrColorText} />
        <Line {...props} />
      </FlexContainer>
    </ColoredText>
  )
}

const ColorPaletteIcon = styled.div<{ color: string }>(({ color }) => {
  return {
    display: 'inline-block',
    backgroundColor: color,
    borderRadius: ' 100%',
    width: '19px',
    height: '19px',
    margin: '3px',
    verticalAlign: 'middle'
  }
})

export const defaultPlugins: TextEditorPlugin[] = [
  createStrongMarkPlugin({
    control: {
      icon: <EdtrIcon icon={edtrBold} />,
      title: 'Fett (Strg + B)'
    }
  }),
  createEmMarkPlugin({
    control: {
      icon: <EdtrIcon icon={edtrItalic} />,
      title: 'Kursiv (Strg + I)'
    }
  }),
  createColorMarkPlugin({
    control: {
      Icon: ColoredTextIcon,
      ColorIcon: ColorPaletteIcon,
      title: 'Textfarben',
      colorTitle: 'Einfärben',
      resetColorTitle: 'Farbe zurücksetzen'
    }
  }),
  createParagraphElementPlugin(),
  createHoveringToolbarPlugin()
]
