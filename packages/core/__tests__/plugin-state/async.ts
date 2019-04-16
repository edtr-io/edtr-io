import { string, async, StoreDeserializeHelpers } from '../../src/plugin-state'

describe('async', () => {
  let helpers: StoreDeserializeHelpers<string, number> & {
    createDocument: jest.Mock
  }
  const tempValue = 'temp'
  const asyncValue = 'async'
  const state = async(
    string(tempValue),
    new Promise(resolve => {
      setTimeout(() => resolve(asyncValue), 100)
    })
  )

  beforeEach(() => {
    helpers = {
      createDocument: jest.fn()
    }
  })

  test('initial with async', () => {
    const initial = state.createInitialState(helpers)
    expect(initial.immediateState).toEqual(tempValue)
    expect(initial.asyncState).toBeDefined()
    if (!initial.asyncState) throw Error('asyncState undefined')
    return initial.asyncState.then(resolvedValue => {
      expect(resolvedValue).toEqual(asyncValue)
    })
  })

  test('return type', () => {
    const returnType = state('currentValue', () => {})
    expect(returnType.value).toEqual('currentValue')
    expect(typeof returnType.set).toEqual('function')
  })
})
