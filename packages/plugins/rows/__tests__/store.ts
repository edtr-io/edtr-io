import { plugins } from '@edtr-io/internal__fixtures'
import * as S from '@edtr-io/store'
import { setupStore, waitUntil } from '@edtr-io/store/__helpers__'
import * as R from 'ramda'

import { isEmptyRows } from '../src/store'

let store: ReturnType<typeof setupStore>

beforeEach(() => {
  store = setupStore()
})

describe('isEmptyRowsState', () => {
  test('empty rows', async () => {
    store.dispatch(
      S.initRoot({
        initialState: {
          plugin: 'rows',
          state: [],
        },
        plugins,
      })
    )
    await waitUntil(() =>
      R.any((action) => action.type === S.pureInsert.type, store.getActions())
    )
    expect(isEmptyRows('root')(store.getState())).toBeTruthy()
  })

  test('single non-empty child', async () => {
    store.dispatch(
      S.initRoot({
        initialState: {
          plugin: 'rows',
          state: [
            {
              plugin: 'video',
              state: {
                src: 'some-src',
                alt: 'some-alt',
              },
            },
          ],
        },
        plugins,
      })
    )
    await waitUntil(
      () =>
        R.filter(
          (action) => action.type === S.pureInsert.type,
          store.getActions()
        ).length >= 2
    )
    expect(isEmptyRows('root')(store.getState())).toBeFalsy()
  })

  test('single empty child', async () => {
    store.dispatch(
      S.initRoot({
        initialState: {
          plugin: 'rows',
          state: [
            {
              plugin: 'video',
              state: {
                src: '',
                alt: '',
              },
            },
          ],
        },
        plugins,
      })
    )
    await waitUntil(
      () =>
        R.filter(
          (action) => action.type === S.pureInsert.type,
          store.getActions()
        ).length >= 2
    )
    expect(isEmptyRows('root')(store.getState())).toBeTruthy()
  })
})
