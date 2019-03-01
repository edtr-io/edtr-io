import * as R from 'ramda'
import { v4 } from 'uuid'

import {
  StateDescriptor,
  StoreDeserializeHelpers,
  StoreSerializeHelpers
} from './types'

export function list<S, T = S, R = unknown>(
  type: StateDescriptor<S, T, R>,
  initialCount = 0
): StateDescriptor<
  S[],
  {
    id: string
    value: T
  }[],
  {
    (): R[]
    items: R[]
    insert: (index?: number) => void
    remove: (index: number) => void
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
        insert(index?: number) {
          onChange((items, helpers) => {
            return R.insert(
              index === undefined ? items.length : index,
              wrap(type.createInitialState(helpers)),
              items
            )
          })
        },
        remove(index: number) {
          onChange(items => {
            return R.remove(index, 1, items)
          })
        }
      })
    },
    {
      createInitialState(helpers: StoreDeserializeHelpers): WrappedValue[] {
        return R.times(() => {
          return wrap(type.createInitialState(helpers))
        }, initialCount)
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
