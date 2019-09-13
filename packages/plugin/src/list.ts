import {
  StateDescriptor,
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

    static createInitialState(helpers: StoreDeserializeHelpers) {
      return R.times(() => {
        return wrap(type.createInitialState(helpers))
      }, initialCount)
    }

    static deserialize(
      serialized: S[],
      helpers: StoreDeserializeHelpers
    ): WrappedValue[] {
      return R.map(s => {
        return wrap(type.deserialize(s, helpers))
      }, serialized)
    }

    static serialize(
      deserialized: WrappedValue[],
      helpers: StoreSerializeHelpers
    ): S[] {
      return R.map(({ value }) => {
        return type.serialize(value, helpers)
      }, deserialized)
    }

    public insert(index?: number, options?: S) {
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

    public remove(index: number) {
      this.onChange(items => {
        return R.remove(index, 1, items)
      })
    }

    public move(from: number, to: number) {
      this.onChange(items => R.move(from, to, items))
    }

    public map<T>(f: (elem: U, index: number) => T): T[] {
      return this.items.map(f)
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

/** @deprecated */
export function legacyList<S, T = S, U = unknown>(
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
      ) => void,
      parentProps?: unknown
    ) => {
      const getItems = () =>
        R.map(
          item => type(item.value, createOnChange(item.id), parentProps),
          items
        )

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
                : type.createInitialState(helpers)
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
      id: generate(),
      value
    }
  }
}
