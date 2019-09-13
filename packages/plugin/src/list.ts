import {
  StoreDeserializeHelpers,
  StoreSerializeHelpers,
  StateType
} from '@edtr-io/abstract-plugin-state'
import * as R from 'ramda'
import { generate } from 'shortid'

export function list<S, T = S, U = unknown>(
  type: StateType<S, T, U>,
  initialCount = 0
): StateType<
  S[],
  {
    id: string
    value: T
  }[],
  {
    insert(index?: number, options?: S): void
    remove(index: number): void
    move(from: number, to: number): void
  } & ArrayLike<U>
> {
  return class ListType {
    [key: number]: U
    public readonly length: number
    protected items: U[]

    constructor(
      protected rawItems: WrappedValue[],
      protected onChange: (
        updater: (
          oldItems: WrappedValue[],
          helpers: StoreDeserializeHelpers
        ) => WrappedValue[]
      ) => void,
      protected pluginProps?: unknown
    ) {
      this.length = rawItems.length
      this.items = rawItems.map(item => {
        return new type(item.value, createOnChange(item.id), pluginProps)
      })
      this.items.forEach((item, index) => {
        this[index] = item
      })

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
    }

    public static createInitialState(helpers: StoreDeserializeHelpers) {
      return R.times(() => {
        return wrap(type.createInitialState(helpers))
      }, initialCount)
    }

    public static deserialize(
      serialized: S[],
      helpers: StoreDeserializeHelpers
    ): WrappedValue[] {
      return R.map(s => {
        return wrap(type.deserialize(s, helpers))
      }, serialized)
    }

    public static serialize(
      deserialized: WrappedValue[],
      helpers: StoreSerializeHelpers
    ): S[] {
      return R.map(({ value }) => {
        return type.serialize(value, helpers)
      }, deserialized)
    }

    public insert = (index?: number, options?: S) => {
      this.onChange((items, helpers) => {
        const wrappedSubstate = wrap(
          options
            ? type.deserialize(options, helpers)
            : type.createInitialState(helpers)
        )
        return R.insert(
          index === undefined ? items.length : index,
          wrappedSubstate,
          items
        )
      })
    }

    public remove = (index: number) => {
      this.onChange(items => {
        return R.remove(index, 1, items)
      })
    }

    public move = (from: number, to: number) => {
      this.onChange(items => R.move(from, to, items))
    }
  }

  interface WrappedValue {
    id: string
    value: T
  }

  function wrap(value: T): WrappedValue {
    return {
      id: generate(),
      value
    }
  }
}
