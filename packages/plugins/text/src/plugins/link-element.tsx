import { faExternalLinkAlt, faTrashAlt, Icon, styled } from '@edtr-io/ui'
import * as React from 'react'
import { Editor as SlateEditor, Element, Range, Transforms } from 'slate'
import { ReactEditor, RenderElementProps } from 'slate-react'

import {
  InlineOverlay,
  InlineOverlayPosition
} from '../components/inline-overlay'
import { useEditor } from '../helpers'
import { TextEditorPlugin } from '../types'

const InlinePreview = styled.span({
  padding: '0px 8px'
})
const ChangeButton = styled.div({
  padding: '5px 5px 5px 10px',
  display: 'inline-block',
  borderLeft: '2px solid rgba(51,51,51,0.95)',
  cursor: 'pointer',
  margin: '2px',
  '&:hover': {
    color: 'rgb(70, 155, 255)'
  }
})

const InlineInputInner = styled.input({
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom: '2px solid #ffffff',
  color: '#ffffff',
  '&:focus': {
    outline: 'none',
    borderBottom: '2px solid rgb(70, 155, 255)'
  }
})

const InlineInputRefForward: React.RefForwardingComponent<
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

export function createLinkElementPlugin({
  control,
  type = 'a',
  Component = Link
}: {
  control?: {
    title: string
    icon: React.ReactNode
  }
  type?: string
  Component?: React.ComponentType<RenderElementProps & { element: LinkElement }>
} = {}): TextEditorPlugin {
  return function(editor) {
    const { controls, isInline, renderEditable, renderElement } = editor

    editor.isInline = element => {
      return element.type === type || isInline(element)
    }
    // eslint-disable-next-line react/display-name
    editor.renderElement = props => {
      if (props.element.type !== type) return renderElement(props)
      return <Component {...props} element={props.element as LinkElement} />
    }
    // eslint-disable-next-line react/display-name
    editor.renderEditable = props => {
      return (
        <React.Fragment>
          {props.editable ? <LinkControls /> : null}
          {renderEditable(props)}
        </React.Fragment>
      )
    }

    if (control) {
      editor.controls = [
        ...controls,
        {
          title: control.title,
          renderIcon() {
            return control.icon
          },
          isActive,
          onClick() {
            isActive() ? unwrap() : wrap()
          }
        }
      ]
    }

    return editor

    function isActive() {
      const [match] = SlateEditor.nodes(editor, {
        match(node) {
          return node.type === type
        }
      })
      return match !== undefined
    }

    function getElement(): LinkElement | undefined {
      const [match] = SlateEditor.nodes(editor, {
        match(node) {
          return node.type === type
        }
      })
      return match && (match[0] as LinkElement)
    }

    function unwrap() {
      Transforms.unwrapNodes(editor, {
        match(node) {
          return node.type === type
        }
      })
    }

    function wrap(href = '') {
      const { selection } = editor
      const isCollapsed = selection && Range.isCollapsed(selection)

      if (isCollapsed) {
        Transforms.insertNodes(editor, {
          type,
          href,
          children: [{ text: 'link' }]
        })
      } else {
        Transforms.wrapNodes(
          editor,
          {
            type,
            href,
            children: []
          },
          { split: true }
        )
        Transforms.collapse(editor, { edge: 'end' })
      }
    }

    function LinkControls() {
      const editor = useEditor()
      const [element, setElement] = React.useState<LinkElement | null>(null)
      const [value, setValue] = React.useState('')

      const { selection } = editor
      React.useEffect(() => {
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
      }, [selection])

      if (!element) return null

      return (
        <InlineOverlay initialPosition={InlineOverlayPosition.below}>
          <InlinePreview>
            <InlineInput
              value={value}
              placeholder="Hier Link einfügen"
              onChange={event => {
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
  }
}

function Link({
  attributes,
  children,
  element
}: RenderElementProps & { element: LinkElement }) {
  return (
    <a {...attributes} href={element.href}>
      {children}
    </a>
  )
}

export interface LinkElement extends Element {
  href: string
}
