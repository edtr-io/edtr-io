import {
  EdtrIcon,
  edtrBold,
  edtrItalic,
  styled,
  edtrColorText,
  edtrLink,
  edtrText,
  edtrFormel,
  edtrQuote
} from '@edtr-io/ui'
import * as React from 'react'

import { TextEditorPlugin } from '../types'
import { createBlockquotePlugin } from './blockquote'
import { createColorMarkPlugin } from './color-mark'
import { createEmMarkPlugin } from './em-mark'
import { createHeadingElementPlugin } from './heading-element'
import { createHoveringToolbarPlugin } from './hovering-toolbar'
import { createLinkElementPlugin } from './link-element'
import { createMathElementPlugin } from './math-element'
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
  createLinkElementPlugin({
    control: {
      icon: <EdtrIcon icon={edtrLink} />,
      title: 'Link (Strg + K)'
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
  createHeadingElementPlugin({
    control: {
      icon: <EdtrIcon icon={edtrText} />,
      levels: {
        1: {
          title: 'Überschrift 1',
          icon: 'H1'
        },
        2: {
          title: 'Überschrift 2',
          icon: 'H2'
        },
        3: {
          title: 'Überschrift 3',
          icon: 'H3'
        }
      },
      title: 'Überschriften',
      resetIcon: <EdtrIcon icon={edtrText} />,
      resetTitle: 'Überschrift entfernen'
    }
  }),
  createMathElementPlugin({
    control: {
      title: 'Matheformel (Strg + M)',
      icon: <EdtrIcon icon={edtrFormel} />
    }
  }),
  createBlockquotePlugin({
    plugin: 'blockquote',
    control: {
      title: 'Zitat',
      icon: <EdtrIcon icon={edtrQuote} />
    }
  }),
  createParagraphElementPlugin(),
  createHoveringToolbarPlugin()
]
