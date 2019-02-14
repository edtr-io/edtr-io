import { createDocument } from '../src'
import { SerializablePlugin } from '../src/plugin'

const customSerializing: SerializablePlugin<
  { unserialized: string },
  { serialized: string }
> = {
  Component: () => null,
  createInitialState: () => {
    return {
      unserialized: 'text'
    }
  },
  deserialize: ({ serialized }) => {
    return {
      unserialized: serialized
    }
  },
  serialize: ({ unserialized }) => {
    return {
      serialized: unserialized
    }
  }
}

export const plugins = {
  stateless: {
    Component: () => null
  },
  stateful: {
    Component: () => null,
    createInitialState: () => {
      return { counter: 0 }
    }
  },
  nested: {
    Component: () => null,
    createInitialState: () => {
      return {
        child: createDocument({
          plugin: 'stateful'
        })
      }
    }
  },
  nestedArray: {
    Component: () => null,
    createInitialState: () => {
      return {
        children: [
          createDocument({
            plugin: 'stateful'
          })
        ]
      }
    }
  },
  customSerializing: customSerializing
}
