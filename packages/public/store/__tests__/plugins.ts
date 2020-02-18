import { setupStore } from '../__helpers__'
import * as S from '../src'

let store: ReturnType<typeof setupStore>

beforeEach(() => {
  store = setupStore()
})

describe('Plugins', () => {
  test('Existing plugins', () => {
    expect(S.getPlugin('text')(store.getState())).toBeDefined()
  })
  test('Non-existing plugin', () => {
    expect(S.getPlugin('foobar')(store.getState())).toBeNull()
  })
})
