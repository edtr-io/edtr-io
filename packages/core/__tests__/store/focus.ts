import * as R from 'ramda'

import { plugins } from '../../__fixtures__/plugins'
import { setupStore, waitUntil } from '../../__helpers__'
import { pureInsert } from '../../src/store/documents/actions'
import {
  findNextNode,
  findPreviousNode,
  getFocusTree,
  Node
} from '../../src/store/focus/reducer'
import { actions, selectors } from '../../src'

let store: ReturnType<typeof setupStore>

beforeEach(() => {
  store = setupStore()
})

describe('Focus', () => {
  describe('FocusDocument', () => {
    test('Blurred initially', () => {
      expect(selectors.isFocused(store.getState(), '0')).toEqual(false)
    })

    test('Focused after requesting focus', () => {
      store.dispatch(actions.focus('0'))
      expect(selectors.isFocused(store.getState(), '0')).toEqual(true)
    })

    test('Blurred after another focus request', () => {
      store.dispatch(actions.focus('0'))
      store.dispatch(actions.focus('1'))
      expect(selectors.isFocused(store.getState(), '0')).toEqual(false)
    })
  })

  describe('getFocusTree', () => {
    test('Height 1', async () => {
      store.dispatch(
        actions.initRoot({
          initialState: {
            plugin: 'nestedArray',
            state: {
              children: [
                {
                  plugin: 'stateful',
                  state: 0
                },
                {
                  plugin: 'stateful',
                  state: 1
                },
                {
                  plugin: 'stateful',
                  state: 2
                },
                {
                  plugin: 'stateful',
                  state: 3
                }
              ]
            }
          },
          plugins,
          defaultPlugin: 'text'
        })
      )
      await waitUntil(
        () =>
          R.filter(
            action => action.type === pureInsert.type,
            store.getActions()
          ).length >= 5
      )

      const tree = getFocusTree(store.getState())
      if (!tree) throw new Error('Expected tree')
      expect(tree.children).toHaveLength(4)
    })

    test('Blockquote in rows', async () => {
      store.dispatch(
        actions.initRoot({
          initialState: {
            plugin: 'rows',
            state: [{ plugin: 'blockquote', state: { plugin: 'text' } }]
          },
          plugins,
          defaultPlugin: 'text'
        })
      )
      await waitUntil(
        () =>
          R.filter(
            action => action.type === pureInsert.type,
            store.getActions()
          ).length >= 2
      )

      const tree = getFocusTree(store.getState())
      if (!tree) throw new Error('Expected tree')
      if (!tree.children) throw new Error('Expected children')
      expect(tree.children[0].children).toHaveLength(1)
    })
  })

  describe('findNextNode', () => {
    const root: Node = {
      id: 'root',
      children: [
        {
          id: 'root.0',
          children: [{ id: 'root.0.0' }, { id: 'root.0.1' }, { id: 'root.0.2' }]
        },
        {
          id: 'root.1',
          children: [{ id: 'root.1.0' }, { id: 'root.1.1' }, { id: 'root.1.2' }]
        },
        {
          id: 'root.0',
          children: [{ id: 'root.2.0' }, { id: 'root.2.1' }, { id: 'root.2.2' }]
        }
      ]
    }

    test('same parent', () => {
      const next = findNextNode(root, 'root.0.0')
      if (!next) throw new Error('Expected to find node')
      expect(next).toEqual('root.0.1')
    })

    test('one level parent', () => {
      const next = findNextNode(root, 'root.0.2')
      if (!next) throw new Error('Expected to find node')
      expect(next).toEqual('root.1.0')
    })

    test('last node', () => {
      const next = findNextNode(root, 'root2.2')
      expect(next).toBeNull()
    })

    test('inner node', () => {
      const next = findNextNode(root, 'root.0')
      if (!next) throw new Error('Expected to find node')
      expect(next).toEqual('root.1.0')
    })

    test('wrap around bug (height 1)', () => {
      const next = findNextNode(
        {
          id: 'root',
          children: [{ id: 'root.0' }, { id: 'root.1' }]
        },
        'root.1'
      )
      expect(next).toBeNull()
    })
  })

  describe('findPreviousNode', () => {
    const root: Node = {
      id: 'root',
      children: [
        {
          id: 'root.0',
          children: [{ id: 'root.0.0' }, { id: 'root.0.1' }, { id: 'root.0.2' }]
        },
        {
          id: 'root.1',
          children: [{ id: 'root.1.0' }, { id: 'root.1.1' }, { id: 'root.1.2' }]
        },
        {
          id: 'root.0',
          children: [{ id: 'root.2.0' }, { id: 'root.2.1' }, { id: 'root.2.2' }]
        }
      ]
    }

    test('same parent', () => {
      const previous = findPreviousNode(root, 'root.0.1')

      if (!previous) {
        throw new Error('Expected to find node')
      }

      expect(previous).toEqual('root.0.0')
    })

    test('one level parent', () => {
      const previous = findPreviousNode(root, 'root.1.0')
      if (!previous) throw new Error('Expected to find node')
      expect(previous).toEqual('root.0.2')
    })

    test('fist node', () => {
      const previous = findPreviousNode(root, 'root0.0')
      expect(previous).toBeNull()
    })

    test('inner node', () => {
      const previous = findPreviousNode(root, 'root.1')
      if (!previous) throw new Error('Expected to find node')
      expect(previous).toEqual('root.0.2')
    })
  })
})
