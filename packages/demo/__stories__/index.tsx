import {
  ActionType,
  Editor,
  EditorContext,
  EditorProps,
  Plugin,
  serializeDocument,
  StatefulPlugin,
  StateType
} from '@edtr-io/core'
import { anchorPlugin } from '@edtr-io/plugin-anchor'
import { blockquotePlugin } from '@edtr-io/plugin-blockquote'
import { geogebraPlugin } from '@edtr-io/plugin-geogebra'
import { highlightPlugin } from '@edtr-io/plugin-highlight'
import { createImagePlugin, UploadConfig } from '@edtr-io/plugin-image'
import { spoilerPlugin } from '@edtr-io/plugin-spoiler'
import { textPlugin } from '@edtr-io/plugin-text'
import { rowsPlugin } from '@edtr-io/ui'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

interface SerloResponse {
  files: { location: string }[]
}

const uploadConfig: UploadConfig<SerloResponse> = {
  url: 'https://de.serlo.org/attachment/upload',
  paramName: 'attachment[file]',
  maxFileSize: 2 * 1024 * 1024,
  allowedExtensions: ['gif', 'jpg', 'jpeg', 'png', 'svg'],
  getAdditionalFields: () => {
    return {
      type: 'file',
      csrf: ((window as unknown) as { csrf: string }).csrf
    }
  },
  getStateFromResponse: response => {
    return {
      src: response.files[0].location
    }
  }
}
const counterState = StateType.number(0)

const counterPlugin: StatefulPlugin<typeof counterState> = {
  // eslint-disable-next-line react/display-name
  Component: ({ editable, focused, state }) => {
    return (
      <div
        style={{
          outline: focused ? '1px solid blue' : 'none'
        }}
      >
        {state.value}
        {editable && (
          <button
            onClick={() => {
              state.set(value => value + 1)
            }}
          >
            +
          </button>
        )}
      </div>
    )
  },
  state: counterState
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plugins: Record<string, Plugin<any>> = {
  anchor: anchorPlugin,
  blockquote: blockquotePlugin,
  counter: counterPlugin,
  highlight: highlightPlugin,
  image: createImagePlugin({ upload: uploadConfig }),
  rows: rowsPlugin,
  spoiler: spoilerPlugin,
  text: textPlugin,
  geogebra: geogebraPlugin
}

// TODO: stringify correctly
storiesOf('EditorProvider', module).add('Counter', () => {
  const state = {
    plugin: 'counter'
  }

  return <Story defaultPlugin="stateless" initialState={state} />
})

storiesOf('Rows Plugin', module)
  .add('Basic example', () => {
    const state = JSON.parse(
      '{"plugin":"rows","state":[{"plugin":"counter","state":1},{"plugin":"counter","state":2},{"plugin":"counter","state":3}]}'
    )

    return <Story defaultPlugin="counter" initialState={state} />
  })
  .add('Initial State', () => {
    const state = {
      plugin: 'rows'
    }

    return <Story defaultPlugin="counter" initialState={state} />
  })

export function LogState() {
  return (
    <EditorContext.Consumer>
      {store => {
        return (
          <button
            onClick={() => {
              const serialized = serializeDocument(store.state)
              const stringified = JSON.stringify({
                state: JSON.stringify(serialized)
              })
              // eslint-disable-next-line no-console
              console.log(stringified.substr(9, stringified.length - 9 - 1))
            }}
          >
            Log State
          </button>
        )
      }}
    </EditorContext.Consumer>
  )
}

export function UndoRedoButtons(props: { enablePersist?: boolean }) {
  const store = React.useContext(EditorContext)
  return (
    <React.Fragment>
      <button
        onClick={() => {
          store.dispatch({
            type: ActionType.Undo
          })
        }}
      >
        Undo
      </button>
      <button
        onClick={() => {
          store.dispatch({
            type: ActionType.Redo
          })
        }}
      >
        Redo
      </button>
      <button
        onClick={() => {
          store.dispatch({
            type: ActionType.Persist
          })
        }}
        disabled={!props.enablePersist}
      >
        Mark persisted
      </button>
    </React.Fragment>
  )
}

export function FocusButtons() {
  const store = React.useContext(EditorContext)
  return (
    <React.Fragment>
      <button
        onClick={() => {
          store.dispatch({
            type: ActionType.FocusPrevious
          })
        }}
      >
        Focus Previous
      </button>
      <button
        onClick={() => {
          store.dispatch({
            type: ActionType.FocusNext
          })
        }}
      >
        FocusNext
      </button>
    </React.Fragment>
  )
}

export function Story(props: {
  defaultPlugin?: string
  initialState: EditorProps['initialState']
}) {
  const [changed, setChanged] = React.useState(false)
  const [editable, setEditable] = React.useState(true)
  return (
    <Editor
      plugins={plugins}
      defaultPlugin={props.defaultPlugin || 'text'}
      initialState={props.initialState}
      changed={setChanged}
      editable={editable}
    >
      <LogState />
      <UndoRedoButtons enablePersist={changed} />
      <FocusButtons />
      <button onClick={() => setEditable(value => !value)}>
        Switch to {editable ? 'render' : 'edit'} mode
      </button>
    </Editor>
  )
}
