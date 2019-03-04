import { StateType } from '../src'

export const plugins = {
  stateless: {
    Component: () => null
  },
  stateful: {
    Component: () => null,
    state: StateType.number(0)
  },
  nested: {
    Component: () => null,
    state: StateType.object({
      child: StateType.child('stateful')
    })
  },
  nestedArray: {
    Component: () => null,
    state: StateType.object({
      children: StateType.list(StateType.child('stateful'), 1)
    })
  }
}
