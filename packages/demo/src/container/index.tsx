import { Editor, EditorInstance, EditorProps } from '@edtr-io/core'
import { select } from '@storybook/addon-knobs'
import * as R from 'ramda'
import * as React from 'react'

import { plugins } from '../plugins'
import { PlainContainer } from './plain'
import { SerloContainer } from './serlo'
import { InnerEditorProps } from '@edtr-io/core/src/editor'

enum Container {
  Plain = 'Plain',
  Serlo = 'Serlo'
}

const Components = {
  [Container.Plain]: PlainContainer,
  [Container.Serlo]: SerloContainer
}

const useEditableState = (initial?: boolean) => {
  return React.useState(typeof initial !== 'undefined' && initial)
}

export function EditorStory(props: Partial<EditorProps>) {
  const [editable, setEditable] = useEditableState(props.editable)
  const defaultContainer =
    (localStorage.getItem('storybook.container') as Container) ||
    Container.Serlo
  const container = select('Container', R.values(Container), defaultContainer)
  React.useEffect(() => {
    localStorage.setItem('storybook.container', container)
  }, [container])
  const children = React.useCallback(
    document => {
      const Component = Components[container]
      return (
        <Component editable={editable} setEditable={setEditable}>
          {document}
        </Component>
      )
    },
    [container, editable, setEditable]
  )

  return (
    <Editor plugins={plugins} defaultPlugin="text" {...props}>
      {children}
    </Editor>
  )
}

export function EditorInstanceStory(
  props: Partial<EditorProps> & InnerEditorProps
) {
  const [editable, setEditable] = useEditableState(props.editable)
  const defaultContainer =
    (localStorage.getItem('storybook.container') as Container) ||
    Container.Serlo
  const container = select('Container', R.values(Container), defaultContainer)
  React.useEffect(() => {
    localStorage.setItem('storybook.container', container)
  }, [container])
  const children = React.useCallback(
    document => {
      const Component = Components[container]
      return (
        <Component editable={editable} setEditable={setEditable}>
          {document}
        </Component>
      )
    },
    [container, editable, setEditable]
  )

  return (
    <EditorInstance plugins={plugins} defaultPlugin="text" {...props}>
      {children}
    </EditorInstance>
  )
}
