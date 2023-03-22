import { faExternalLinkAlt, faTrashAlt, Icon, styled } from '@edtr-io/ui'
import * as React from 'react'
import { Editor as SlateEditor, Range, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

import {
  InlineOverlay,
  InlineOverlayPosition,
} from '../components/inline-overlay'
import type { Link, TextEditorPluginConfig } from '../types'
import { getLinkElement, isLinkActive } from '../utils/link'
import { LinkControlsInput } from './link-controls-input'

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

interface LinkControlsProps {
  hasSelectionChanged: number
  editor: SlateEditor
  config: TextEditorPluginConfig
  isLinkNewlyCreated: boolean
  setIsLinkNewlyCreated: (value: boolean) => void
}

export function LinkControls({
  hasSelectionChanged,
  editor,
  config,
  isLinkNewlyCreated,
  setIsLinkNewlyCreated,
}: LinkControlsProps) {
  const [element, setElement] = React.useState<Link | null>(null)
  const [value, setValue] = React.useState('')
  const input = React.useRef<HTMLInputElement>(null)

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
  }, [hasSelectionChanged, selection, editor])

  React.useEffect(() => {
    if (element && isLinkNewlyCreated) {
      setTimeout(() => {
        setIsLinkNewlyCreated(false)
        input.current?.focus()
      })
    }
  }, [element, isLinkNewlyCreated, setIsLinkNewlyCreated])

  if (!element) return null

  return (
    <InlineOverlay
      config={config}
      initialPosition={InlineOverlayPosition.below}
    >
      <InlinePreview>
        <LinkControlsInput
          ref={input}
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
