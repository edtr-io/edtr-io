import { createDocument } from '../src'

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
  }
}
