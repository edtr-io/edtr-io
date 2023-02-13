import {
  DeepPartial,
  faExternalLinkAlt,
  faTrashAlt,
  Icon,
  styled,
} from '@edtr-io/ui'
import * as React from 'react'
import { Editor as SlateEditor, Range, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

import {
  InlineOverlay,
  InlineOverlayPosition,
} from '../components/inline-overlay'
import type { Link, TextPluginConfig } from '../types'
import { getLinkElement, isLinkActive } from '../utils/link'

const InlinePreview = styled.span({
  padding: '0px 8px',
})

const ChangeButton = styled.div(({ theme }) => ({
  padding: '5px 5px 5px 10px',
  display: 'inline-block',
  borderLeft: `2px solid ${theme.borderColor}`,
  cursor: 'pointer',
  margin: '2px',
  '&:hover': {
    color: theme.hoverColor,
  },
}))

const InlineInputInner = styled.input(({ theme }) => ({
  backgroundColor: theme.backgroundColor,
  border: 'none',
  borderBottom: `2px solid ${theme.color}`,
  color: theme.color,
  '&:focus': {
    outline: 'none',
    borderBottom: `2px solid ${theme.hoverColor}`,
  },
}))

// TODO: update
const InlineInputRefForward: React.ForwardRefRenderFunction<
  HTMLInputElement,
  InputProps
> = (props, ref) => {
  return <InlineInputInner {...props} ref={ref} />
}
const InlineInput = React.forwardRef(InlineInputRefForward)

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  theme: DeepPartial<TextPluginConfig['theme']>
  label?: string
  textfieldWidth?: string
  editorInputWidth?: string
}

export function LinkControls({
  editor,
  config,
}: {
  editor: SlateEditor
  config: TextPluginConfig
}) {
  const [element, setElement] = React.useState<Link | null>(null)
  const [value, setValue] = React.useState('')

  const { selection } = editor

  React.useEffect(() => {
    if (!selection) return

    const isCollapsed = selection && Range.isCollapsed(selection)

    if (isCollapsed && isLinkActive(editor)) {
      const element = getLinkElement(editor) || null
      setElement(element)
      setValue(element ? element.href : '')
    } else {
      setElement(null)
    }
  }, [selection, editor])

  if (!element) return null

  return (
    <InlineOverlay
      config={config}
      initialPosition={InlineOverlayPosition.below}
    >
      <InlinePreview>
        <InlineInput
          theme={config.theme}
          value={value}
          placeholder={config.i18n.link.placeholder}
          onChange={(event) => {
            setValue(event.target.value)
            const path = ReactEditor.findPath(editor, element)
            Transforms.setNodes(
              editor,
              { href: event.target.value },
              { at: path }
            )
          }}
        />
      </InlinePreview>
      <ChangeButton
        theme={config.theme}
        as="a"
        target="_blank"
        href={value}
        rel="noopener noreferrer"
      >
        <Icon icon={faExternalLinkAlt} />
      </ChangeButton>
      <ChangeButton
        theme={config.theme}
        onClick={() => {
          setElement(null)
          const path = ReactEditor.findPath(editor, element)
          Transforms.unwrapNodes(editor, { at: path })
        }}
      >
        <Icon icon={faTrashAlt} />
      </ChangeButton>
    </InlineOverlay>
  )
}
