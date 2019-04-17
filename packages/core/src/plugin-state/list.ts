import * as R from 'ramda'
import { v4 } from 'uuid'

import {
  StateDescriptor,
  StoreDeserializeHelpers,
  StoreSerializeHelpers
} from './types'
import { AsyncState } from '../plugin'

export function list<S, T = S, U = unknown>(
  type: StateDescriptor<S, T, U>,
  initialCount = 0
): StateDescriptor<
  S[],
  {
    id: string
    value: T
  }[],
  {
    (): U[]
    items: U[]
    insert: (index?: number, options?: S) => void
    remove: (index: number) => void
    move: (from: number, to: number) => void
  }
> {
  interface WrappedValue {
    id: string
    value: T
  }
  return Object.assign(
    (
      items: WrappedValue[],
      onChange: (
        updater: (
          oldItems: WrappedValue[],
          helpers: StoreDeserializeHelpers
        ) => AsyncState<WrappedValue[]>
      ) => void
    ) => {
      const getItems = () =>
        R.map(item => type(item.value, createOnChange(item.id)), items)

      function createOnChange(id: string) {
        return (
          updater: (
            oldValue: T,
            helpers: StoreDeserializeHelpers
          ) => AsyncState<T>
        ) => {
          onChange(
            (oldItems: WrappedValue[], helpers: StoreDeserializeHelpers) => {
              const index = R.findIndex(R.propEq('id', id), oldItems)
              const updatedValue = updater(oldItems[index].value, helpers)
              return {
                immediateState: updateValue(updatedValue.immediateState),
                asyncState: updatedValue.asyncState
                  ? updatedValue.asyncState.then(updateValue)
                  : undefined
              }
              function updateValue(value: T) {
                return R.update(index, { value: value, id: id }, oldItems)
              }
            }
          )
        }
      }

      return Object.assign(getItems, {
        items: getItems(),
        insert(index?: number, options?: S) {
          onChange((items, helpers) => {
            const initial =
              options === undefined
                ? type.createInitialState(helpers)
                : type.deserialize(options, helpers)

            const wrappedSubstate = wrap(initial.immediateState)
            let asyncState: Promise<WrappedValue[]> | undefined
            if (initial.asyncState) {
              asyncState = initial.asyncState
                .then(wrap)
                .then(resolvedSubstate => {
                  return R.insert(
                    index === undefined ? items.length : index,
                    resolvedSubstate,
                    items
                  )
                })
            }

            return {
              immediateState: R.insert(
                index === undefined ? items.length : index,
                wrappedSubstate,
                items
              ),
              asyncState
            }
          })
        },
        remove(index: number) {
          onChange(items => {
            return {
              immediateState: R.remove(index, 1, items)
            }
          })
        },
        move(from: number, to: number) {
          onChange(items => {
            return {
              immediateState: R.move(from, to, items)
            }
          })
        }
      })
    },
    {
      createInitialState(helpers: StoreDeserializeHelpers) {
        const initialStates = R.times(
          () => type.createInitialState(helpers),
          initialCount
        )
        return createAsyncState(initialStates)
      },
      deserialize(serialized: S[], helpers: StoreDeserializeHelpers) {
        const deserializedStates = serialized.map(s =>
          type.deserialize(s, helpers)
        )
        return createAsyncState(deserializedStates)
      },
      serialize(
        deserialized: WrappedValue[],
        helpers: StoreSerializeHelpers
      ): S[] {
        return R.map(({ value }) => {
          return type.serialize(value, helpers)
        }, deserialized)
      }
    }
  )

  function createAsyncState(
    states: AsyncState<T>[]
  ): AsyncState<WrappedValue[]> {
    const initialStates = states.map(state => ({
      immediateState: wrap(state.immediateState),
      asyncState: state.asyncState
        ? state.asyncState.then(resolvedState => wrap(resolvedState))
        : // Promise existing state
          Promise.resolve(wrap(state.immediateState))
    }))
    const immediateStates = R.reduce(
      (acc, initialState) => {
        return R.append(initialState.immediateState, acc)
      },
      [] as WrappedValue[],
      initialStates
    )

    const asyncState = Promise.all(initialStates.map(state => state.asyncState))
    return {
      immediateState: immediateStates,
      asyncState: asyncState
    }
  }
  function wrap(value: T): WrappedValue {
    return {
      id: v4(),
      value
    }
  }
}
