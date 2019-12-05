# StateType API for plugin states

Plugins use a common API for their state, which provides helper functions to the plugin developer, that interact with the core correctly. The provided types are

- `scalar` - represents a single value, (also `string`, `boolean`, and `number` exist for convenience)
- `serializedScalar` - represents a single values needing a serializer
- `child` - represents an other plugin or sub document
- `object` - composes other StateTypes to an object
- `list` - represents a collection of an other StateType
- `upload`

## Usage

### `scalar`

The `scalar` type handles single values of a consistent type. For standard types `string`, `boolean` and `number` the respective StateTypes can bes used and are functionally equivalent.

#### API

A `state` created with `scalar` exposes:

- `state.get()` - getter for the current stored value
- `state.value` - the current stored value
- `state.set(newValue: T | (currentValue: T) => T)` - function expecting a new value or an update function

#### Example

```typescript
import { scalar, Plugin } from '@edtr-io/plugin'
import * as React from 'react'

const counterState = scalar(0) // equivalent to number(0)

const counterPlugin: Plugin<typeof counterState> = {
  Component: ({ state }) => {
    return (
      <div>
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
```

### `serializedScalar`

The `serializedScalar` adds a serializer logic around `scalar` and uses the same API. The plugin always receives the deserialized value, but a serialized value will be exported by the editor on serialization.

#### API

See `scalar`

#### Example

```typescript
import { serializedScalar, Plugin } from '@edtr-io/plugin'
import * as React from 'react'

const serializer = {
  deserialize: JSON.parse,
  serialize: JSON.stringify
}
const jsonState = serializedScalar({ foo: 'bar' }, serializer)

const jsonPlugin: Plugin<typeof jsonState> = {
  Component: ({ state }) => {
    return (
      <div>
        <input
          type="text"
          value={state.value.foo}
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

### `child`

The `child` type is used for including another plugin or whole sub document. Handling the state and actions of the sub document is done by the editor core automatically.

#### API

A `state` created with `child` exposes:

- `state.get()` - getter for the plugin id
- `state.id` - the plugin id
- `state.render()` - helper rendering the child in a `<Document>` component

#### Example

```typescript
import { child, Plugin } from '@edtr-io/plugin'
import * as React from 'react'

const spoilerState = child()

const spoilerPlugin: Plugin<typeof spoilerState> = {
  Component: ({ state }) => {
    const [hidden, setHidden] = React.useState(true)
    return (
      <div>
        <div onClick={() => setHidden(!hidden)}>
          <p>Toggle visibility</p>
        </div>
        <div>{state.render()}</div>
      </div>
    )
  },
  state: spoilerState
}
```

### `object`

With the `object` type you can compose other StateTypes to an object.

#### API

A `state` created with `object` exposes:

- all the properties directly on `state`

#### Example

Syntax highlighting example using `react-syntax-highlighter`

```typescript

import { object, string, boolean, Plugin } from '@edtr-io/plugin'
import * as React from 'react'
import SyntaxHighlight from 'react-syntax-highlighter'

const highlighterState = object({
  text: string(`console.log('Hello World')`),
  showLineNumbers: boolean(true)
})

const highlighterPlugin: Plugin<typeof highlighterState> = {
  Component: ({ state }) => {
    return (
      <div>
        <SyntaxHighlight
          language="javascript"
          showLineNumbers={
            state.showLineNumbers.value
          }
        >
          {state.text.value}
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

### `list`

With the `list` type you can handle a collection of other StateTypes

#### API

A `state` created with `list` exposes:

- `state` - the items as array
- `state.insert(index?: number, initialItemState?: S)` - helper function for inserting a new item at the specified index (default: append as last item). Optionally pass an initial state for the item.
- `state.remove(index: number)` - helper function for removing an item
- `state.move(from: number, to: number)` - helper function for moving an item in the list to an other position

#### Example

```typescript
import { list, child, Plugin } from '@edtr-io/plugin'
import * as React from 'react'

const rowsState = list(child(), 1)

const rowsPlugin: Plugin<typeof highlighterState> = {
  Component: ({ state }) => {
    return (
      <div>
        {state.map(
          (item, index) => {
            return (
              <div>
                {item.render()}
                <button onClick={() => state.insert(index + 1)}>Add</button>
                <button onClick={() => state.remove(index)}>Remove</button>
                { index > 0 ? <button onClick={() => state.move(index, index-1)}>Move up</button> : null }
                { index + 1 < state.length ? <button onClick={() => state.move(index, index+1)}>Move down</button> : null}
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

### `upload`

With `upload` type you can handle asynchronous uploads of files, resolving to a url at the end

#### API

A `state` created with `upload` exposes:

- `state.value` - the current value, either `string` or a pending file upload
- `state.set` - set the value to a url
- `state.upload` - upload a file
