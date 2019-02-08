import {createDocumentIdentifier} from '@edtr-io/core'

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
        child: createDocumentIdentifier({
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
          createDocumentIdentifier({
            plugin: 'stateful'
          })
        ]
      }
    }
  }
}
