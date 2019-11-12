import { plugins } from '@edtr-io/internal__fixtures'
import * as R from 'ramda'

import { setupStore, waitUntil } from '../__helpers__'
import * as S from '../src'
import { pureInsert } from '../src/documents/actions'
import { focus } from '../src/focus/actions'
import {
  findNextNode,
  findPreviousNode,
  getFocusTree,
  getFocusPath,
  hasFocusedChild,
  hasFocusedDescendant,
  isFocused,
  Node
} from '../src/focus/reducer'

let store: ReturnType<typeof setupStore>

beforeEach(() => {
  store = setupStore()
})

describe('Focus', () => {
  describe('FocusDocument', () => {
    test('Blurred initially', () => {
      expect(S.isFocused('0')(store.getState())).toEqual(false)
    })

    test('Focused after requesting focus', () => {
      store.dispatch(S.focus('0'))
      expect(S.isFocused('0')(store.getState())).toEqual(true)
    })

    test('Blurred after another focus request', () => {
      store.dispatch(S.focus('0'))
      store.dispatch(S.focus('1'))
      expect(S.isFocused('0')(store.getState())).toEqual(false)
    })
  })

  describe('getFocusTree', () => {
    test('Height 1', async () => {
      store.dispatch(
        S.initRoot({
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

      const tree = getFocusTree()(store.getState())
      if (!tree) throw new Error('Expected tree')
      expect(tree.children).toHaveLength(4)
    })

    test('Blockquote in rows', async () => {
      store.dispatch(
        S.initRoot({
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

      const tree = getFocusTree()(store.getState())
      if (!tree) throw new Error('Expected tree')
      if (!tree.children) throw new Error('Expected children')
      expect(tree.children[0].children).toHaveLength(1)
    })
  })

  describe('getFocusPath', () => {
    beforeEach(async () => {
      store.dispatch(
        S.initRoot({
          initialState: {
            plugin: 'nestedArray',
            state: {
              children: [
                {
                  plugin: 'nestedArray',
                  children: [
                    {
                      plugin: 'stateful',
                      stat: 0
                    }
                  ]
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
    })

    test('null if the given document is not part of the focus tree', () => {
      const path = getFocusPath('foobar')(store.getState())
      expect(path).toEqual(null)
    })

    test('all ids from root to the given document if it is part of focus tree', () => {
      const tree = getFocusTree()(store.getState())
      if (!tree) throw new Error('Expected focus tree to exist')
      const level1Node = tree.children && tree.children[0]
      if (!level1Node) throw new Error('Expected level 1 node to exist')
      const level2Node = level1Node.children && level1Node.children[0]
      if (!level2Node) throw new Error('Expected level 2 node to exist')
      const path = getFocusPath(level2Node.id)(store.getState())
      expect(path).toEqual([tree.id, level1Node.id, level2Node.id])
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

  describe('isFocused, hasFocusedChild, hasFocusedDescendant', () => {
    let rootId: string
    let level1Id: string
    let leafId: string

    beforeEach(async () => {
      store.dispatch(
        S.initRoot({
          initialState: {
            plugin: 'nestedArray',
            state: {
              children: [
                {
                  plugin: 'nestedArray',
                  state: {
                    children: [{ plugin: 'stateful', state: 0 }]
                  }
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
          ).length >= 3
      )
      const tree = getFocusTree()(store.getState())
      if (!tree) throw new Error('Expected tree')
      rootId = tree.id
      if (!tree.children) throw new Error('Expected child')
      level1Id = tree.children[0].id
      if (!tree.children[0].children) throw new Error('Expected leaf')
      leafId = tree.children[0].children[0].id
    })

    describe('isFocused', () => {
      test('true for focused document', () => {
        store.dispatch(focus(leafId))
        expect(isFocused(leafId)(store.getState())).toBeTruthy()
      })

      test('false for blurred document', () => {
        store.dispatch(focus(leafId))
        expect(isFocused(level1Id)(store.getState())).toBeFalsy()
      })
    })

    describe('hasFocusedChild', () => {
      test('true for direct ancestor of focused document', () => {
        store.dispatch(focus(leafId))
        expect(hasFocusedChild(level1Id)(store.getState())).toBeTruthy()
      })

      test('false for focused document', () => {
        store.dispatch(focus(leafId))
        expect(hasFocusedChild(leafId)(store.getState())).toBeFalsy()
      })

      test('false for indirect ancestor of focused document', () => {
        store.dispatch(focus(leafId))
        expect(hasFocusedChild(rootId)(store.getState())).toBeFalsy()
      })
    })

    describe('hasFocusedDescendant', () => {
      test('true for direct ancestor of focused document', () => {
        store.dispatch(focus(leafId))
        expect(hasFocusedDescendant(level1Id)(store.getState())).toBeTruthy()
      })

      test('false for focused item', () => {
        store.dispatch(focus(leafId))
        expect(hasFocusedDescendant(leafId)(store.getState())).toBeFalsy()
      })

      test('true for indirect ancestor of focused item', () => {
        store.dispatch(focus(leafId))
        expect(hasFocusedDescendant(rootId)(store.getState())).toBeTruthy()
      })
    })
  })
})
