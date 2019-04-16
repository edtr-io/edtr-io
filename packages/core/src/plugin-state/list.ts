import * as R from 'ramda'
import { v4 } from 'uuid'

import {
  StateDescriptor,
  StoreDeserializeHelpers,
  StoreSerializeHelpers
} from './types'

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
        ) => WrappedValue[]
      ) => void
    ) => {
      const getItems = () =>
        R.map(item => type(item.value, createOnChange(item.id)), items)

      function createOnChange(id: string) {
        return (
          updater: (oldValue: T, helpers: StoreDeserializeHelpers) => T
        ) => {
          onChange(
            (oldItems: WrappedValue[], helpers: StoreDeserializeHelpers) => {
              const index = R.findIndex(R.propEq('id', id), oldItems)
              return R.update(
                index,
                { value: updater(oldItems[index].value, helpers), id: id },
                oldItems
              )
            }
          )
        }
      }

      return Object.assign(getItems, {
        items: getItems(),
        insert(index?: number, options?: S) {
          onChange((items, helpers) => {
            const wrappedSubstate = wrap(
              options
                ? type.deserialize(options, helpers)
                : //FIXME: handel asyncState if set
                  type.createInitialState(helpers).immediateState
            )
            return R.insert(
              index === undefined ? items.length : index,
              wrappedSubstate,
              items
            )
          })
        },
        remove(index: number) {
          onChange(items => {
            return R.remove(index, 1, items)
          })
        },
        move(from: number, to: number) {
          onChange(items => R.move(from, to, items))
        }
      })
    },
    {
      createInitialState(helpers: StoreDeserializeHelpers) {
        const initialStates = R.times(
          () => type.createInitialState(helpers),
          initialCount
        ).map(state => ({
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

        const asyncState = Promise.all(
          initialStates.map(state => state.asyncState)
        )
        return {
          immediateState: immediateStates,
          asyncState: asyncState
        }
      },
      deserialize(
        serialized: S[],
        helpers: StoreDeserializeHelpers
      ): WrappedValue[] {
        return R.map(s => {
          return wrap(type.deserialize(s, helpers))
        }, serialized)
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

  function wrap(value: T): WrappedValue {
    return {
      id: v4(),
      value
    }
  }
}
