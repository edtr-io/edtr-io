import { asyncScalar, StateUpdater } from '@edtr-io/plugin'

const deserializeHelpers = {
  createDocument: () => {}
}
const serializeHelpers = {
  getDocument: () => null
}

describe('asyncScalar', () => {
  interface TempState {
    tmp: number
  }

  function isTempState(value: number | TempState) {
    return typeof (value as TempState).tmp !== 'undefined'
  }

  test('initial state', () => {
    const state = asyncScalar<number, TempState>(3, isTempState)
    expect(state.createInitialState(deserializeHelpers)).toEqual(3)
  })

  test('remove temp state on serialize', () => {
    const state = asyncScalar<number, TempState>(0, isTempState)
    expect(state.serialize({ tmp: 4 }, serializeHelpers)).toEqual(0)
    expect(state.serialize(4, serializeHelpers)).toEqual(4)
  })

  test('deserialize just passes through', () => {
    const state = asyncScalar<number, TempState>(0, isTempState)
    expect(state.deserialize(4, deserializeHelpers)).toEqual(4)
  })

  test('async set', async () => {
    const initial = 0
    const state = asyncScalar<number, TempState>(initial, isTempState)

    let store: number | TempState = initial
    const onChange = (updater: StateUpdater<number | TempState>) => {
      store = updater.immediate(store, deserializeHelpers)
      if (updater.resolver) {
        updater.resolver(
          resolveUpdater => {
            store = resolveUpdater(store, deserializeHelpers)
          },
          rejectUpdater => {
            store = rejectUpdater(store, deserializeHelpers)
          },
          nextUpdater => {
            store = nextUpdater(store, deserializeHelpers)
          }
        )
      }
    }
    const scalarValue = state.init(initial, onChange)

    scalarValue.set({
      immediate: { tmp: 1 },
      resolver: (resolve, reject, next) => {
        setTimeout(() => {
          next({ tmp: 2 })
          setTimeout(() => {
            next({ tmp: 3 })
            setTimeout(() => {
              resolve(3)
            }, 100)
          }, 100)
        }, 100)
      }
    })
    expect(store).toEqual({ tmp: 1 })
    await wait(400)
    expect(store).toEqual(3)
  })
})

function wait(time = 10): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}
