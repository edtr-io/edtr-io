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
import { spoilerPlugin } from '@edtr-io/plugin-spoiler'
import { textPlugin } from '@edtr-io/plugin-text'
import { Overlay, rowsPlugin } from '@edtr-io/ui'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

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
  anchor: anchorPlugin,
  blockquote: blockquotePlugin,
  counter: counterPlugin,
  highlight: highlightPlugin,
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

export function Story(props: {
  defaultPlugin?: string
  initialState: EditorProps['initialState']
}) {
  const [changed, setChanged] = React.useState(false)
  return (
    <Editor
      plugins={plugins}
      defaultPlugin={props.defaultPlugin || 'text'}
      initialState={props.initialState}
      changed={setChanged}
    >
      <LogState />
      <Overlay />
      <UndoRedoButtons enablePersist={changed} />
    </Editor>
  )
}
