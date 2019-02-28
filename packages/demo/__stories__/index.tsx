import {
  ActionType,
  createDocument,
  DocumentIdentifier,
  Editor,
  EditorContext,
  Plugin,
  serializeDocument,
  StatefulPlugin,
  StateType
} from '@edtr-io/core'
import { Overlay, rowsPlugin } from '@edtr-io/ui'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { textPlugin } from '@edtr-io/plugin-text'

const counterState = StateType.number(0)

const counterPlugin: StatefulPlugin<typeof counterState> = {
  // eslint-disable-next-line react/display-name
  Component: ({ focused, state }) => {
    return (
      <div
        style={{
          outline: focused ? '1px solid blue' : 'none'
        }}
      >
        {state.value}
        <button
          onClick={() => {
            state.set(value => value + 1)
          }}
        >
          +
        </button>
      </div>
    )
  },
  state: counterState
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plugins: Record<string, Plugin<any>> = {
  counter: counterPlugin,
  rows: rowsPlugin,
  text: textPlugin
}

// TODO: stringify correctly
storiesOf('EditorProvider', module).add('Counter', () => {
  const state = createDocument({
    plugin: 'counter'
  })

  return <Story defaultPlugin="stateless" state={state} />
})

storiesOf('RowsPlugin', module)
  .add('Basic example', () => {
    const state = createDocument(
      JSON.parse(
        '{"type":"@edtr-io/document","plugin":"rows","state":[{"type":"@edtr-io/document","plugin":"counter","state":1},{"type":"@edtr-io/document","plugin":"counter","state":2},{"type":"@edtr-io/document","plugin":"counter","state":3}]}'
      )
    )

    return <Story defaultPlugin="counter" state={state} />
  })
  .add('initial state', () => {
    const state = createDocument({
      plugin: 'rows'
    })

    return <Story defaultPlugin="counter" state={state} />
  })

export function LogState({ state }: { state: DocumentIdentifier }) {
  return (
    <EditorContext.Consumer>
      {store => {
        return (
          <button
            onClick={() => {
              const serialized = serializeDocument(store.state, state.id)
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

export function Story(props: {
  defaultPlugin: string
  state: DocumentIdentifier
}) {
  const [changed, setChanged] = React.useState(false)
  return (
    <Editor
      plugins={plugins}
      defaultPlugin={props.defaultPlugin}
      state={props.state}
      changed={setChanged}
    >
      <LogState state={props.state} />
      <Overlay />
      <UndoRedoButtons enablePersist={changed} />
    </Editor>
  )
}
