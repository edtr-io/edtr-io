# StateType API for plugin states

Plugins use a common API for their state, which provides helper functions to the plugin developer, that interact with the core correctly. The provided types are

- `scalar` - represents a single value, (also `string`, `boolean`, and `number` exist for convenience)
- `serializedScalar` - represents a single values needing a serializer
- `child` - represents an other plugin or sub document
- `object` - composes other StateTypes to an object
- `list` - represents a collection of an other StateType

## Usage

### `StateType.scalar`

The `scalar` type handles single values of a consistent type. For standard types `string`, `boolean` and `number` the respective StateTypes can bes used and are functionally equivalent.

#### API

A `state` created with `StateType.scalar` exposes:

- `state()` - getter for the current stored value
- `state.value` - the current stored value
- `state.set(newValue: T | (currentValue: T) => T)` - function expecting a new value or an update function

#### Example

```typescript
const counterState = StateType.scalar(0) // equivalent to StateType.number(0)

const counterPlugin: StatefulPlugin<typeof counterState> = {
  Component: ({ state }) => {
    return (
      <div>
        {state.value /* equivalent to state() */}
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
```

### `StateType.serializedScalar`

The `serializedScalar` adds a serializer logic around `StateType.scalar` and uses the same API. The plugin always receives the deserialized value, but a serialized value will be exported by the editor on serialization.

#### API

See `StateType.scalar`

#### Example

```typescript
const serializer = {
  deserialize: JSON.parse,
  serialize: JSON.stringify
}
const jsonState = StateType.serializedScalar({ foo: 'bar' }, serializer)

const jsonPlugin: StatefulPlugin<typeof jsonState> = {
  Component: ({ state }) => {
    return (
      <div>
        <input
          type="text"
          value={state.value.foo /* equivalent to state().foo */}
          onChange={e =>
            state.set({
              foo: e.target.value
            })
          }
        />
      </div>
    )
  },
  state: jsonState
}
```

### `StateType.child`

The `child` type is used for including another plugin or whole sub document. Handling the state and actions of the sub document is done by the editor core automatically.

#### API

A `state` created with `StateType.child` exposes:

- `state()` - getter for the plugin id
- `state.id` - the plugin id
- `state.render()` - helper rendering the child in a `<Document>` component

#### Example

```typescript
const spoilerState = StateType.child()

const spoilerPlugin: StatefulPlugin<typeof spoilerState> = {
  Component: ({ state }) => {
    const [hidden, setHidden] = React.useState(true)
    return (
      <div>
        <div onClick={() => setHidden(!hidden)}>
          <p>Toggle visibility</p>
        </div>
        <div>
          {state.render() /* equivalent to <Document id={state.id}/> */}
        </div>
      </div>
    )
  },
  state: spoilerState
}
```

### `StateType.object`

With the `object` type you can compose other StateTypes to an object.

#### API

A `state` created with `StateType.object` exposes:

- `state()` - getter for the object of the states
- all the properties directly on `state`

#### Example

Syntax highlighting example using `react-syntax-highlighter`

```typescript
const highlighterState = StateType.object({
  text: StateType.string(`console.log('Hello World')`),
  showLineNumbers: StateType.boolean(true)
})

const highlighterPlugin: StatefulPlugin<typeof highlighterState> = {
  Component: ({ state }) => {
    return (
      <div>
        <SyntaxHighlight
          language="javascript"
          showLineNumbers={
            state.showLineNumbers
              .value /* equivalent to state().showLineNumbers() */
          }
        >
          {state.text.value /* equivalent to state().text() */}
        </SyntaxHighlight>
        <hr />
        <textarea
          onChange={e => {
            state.text.set(e.target.value)
          }}
        >
          {state.text.value}
        </textarea>
        <input
          type="checkbox"
          checked={state.lineNumbers.value}
          onChange={e => {
            state.lineNumbers.set(e.target.checked)
          }}
        />
      </div>
    )
  },
  state: highlighterState
}
```

### `StateType.list`

With the `list` type you can handle a collection of other StateTypes

#### API

A `state` created with `StateType.list` exposes:

- `state()` - getter for the items state collection
- `state.items` - the items state collection
- `state.insert(index?: number, initialItemState?: S)` - helper function for inserting a new item at the specified index (default: append as last item). Optionally pass an initial state for the item.
- `state.remove(index: number)` - helper function for removing an item

#### Example

```typescript
const rowsState = StateType.list(StateType.child(), 1)

const rowsPlugin: StatefulPlugin<typeof highlighterState> = {
  Component: ({ state }) => {
    return (
      <div>
        {state.items.map(
          /* equivalent to state().map */
          (item, index) => {
            return (
              <div>
                {item.render()}
                <button onClick={() => state.insert(index + 1)}>Add</button>
                <button onClick={() => state.remove(index)}>Remove</button>
              </div>
            )
          }
        )}
      </div>
    )
  },
  state: rowsState
}
```
