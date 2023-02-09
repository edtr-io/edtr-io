import { faExternalLinkAlt, faTrashAlt, Icon, styled } from '@edtr-io/ui'
import * as React from 'react'
import { Editor as SlateEditor, Element, Range, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

import {
  InlineOverlay,
  InlineOverlayPosition,
} from '../components/inline-overlay'
import { Link, TextPluginConfig } from '../types'

const InlinePreview = styled.span({
  padding: '0px 8px',
})

const ChangeButton = styled.div({
  padding: '5px 5px 5px 10px',
  display: 'inline-block',
  borderLeft: '2px solid rgba(51,51,51,0.95)',
  cursor: 'pointer',
  margin: '2px',
  '&:hover': {
    color: 'rgb(70, 155, 255)',
  },
})

const InlineInputInner = styled.input({
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom: '2px solid #ffffff',
  color: '#ffffff',
  '&:focus': {
    outline: 'none',
    borderBottom: '2px solid rgb(70, 155, 255)',
  },
})

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
  label?: string
  textfieldWidth?: string
  editorInputWidth?: string
}

// TODO: rename SlateEditor into Editor
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
    // TODO: Refactor with isLinkActive() in hovering-toolbar
    // TODO: Use faster check whether generator is empty
    function isActive() {
      const [match] = Array.from(
        SlateEditor.nodes(editor, {
          match(node) {
            return Element.isElement(node) && node.type === 'a'
          },
        })
      )
      return match !== undefined
    }

    function getElement(): Link | undefined {
      const [match] = Array.from(
        SlateEditor.nodes(editor, {
          match(node) {
            return Element.isElement(node) && node.type === 'a'
          },
        })
      )
      return match && (match[0] as Link)
    }

    if (selection) {
      const isCollapsed = selection && Range.isCollapsed(selection)

      if (isCollapsed && isActive()) {
        const element = getElement() || null
        setElement(element)
        setValue(element ? element.href : '')
      } else {
        setElement(null)
      }
    }
  }, [selection, editor])

  if (!element) return null

  return (
    <InlineOverlay initialPosition={InlineOverlayPosition.below}>
      <InlinePreview>
        <InlineInput
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
        as="a"
        target="_blank"
        href={value}
        rel="noopener noreferrer"
      >
        <Icon icon={faExternalLinkAlt} />
      </ChangeButton>
      <ChangeButton
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
