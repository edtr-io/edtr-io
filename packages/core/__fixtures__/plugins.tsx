import { StateType } from '../src'
import { StateDescriptorReturnType } from '../src/plugin-state'

import { blockquotePlugin } from '@edtr-io/plugin-blockquote'
import { rowsPlugin } from '@edtr-io/plugin-rows'
import { textPlugin } from '@edtr-io/plugin-text'

const nestedArrayState = StateType.object({
  children: StateType.list(StateType.child('stateful'), 1)
})

const nestedState = StateType.object({
  child: StateType.child('stateful')
})

const statefulState = StateType.number(0)

export const plugins = {
  rows: rowsPlugin,
  blockquote: blockquotePlugin,
  text: textPlugin,
  stateless: {
    Component: () => null
  },
  stateful: {
    Component: () => null,
    state: statefulState
  },
  nested: {
    Component: () => null,
    state: nestedState
  },
  nestedArray: {
    Component: () => null,
    state: nestedArrayState,
    getFocusableChildren: (
      state: StateDescriptorReturnType<typeof nestedArrayState>
    ) => {
      return state.children()
    }
  }
}
