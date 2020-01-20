import {
  StoreDeserializeHelpers,
  StateType,
  StateUpdater,
  StateExecutor
} from '@edtr-io/internal__plugin-state'
import * as R from 'ramda'
import { generate } from 'shortid'

/**
 * @param type - The {@link @edtr-io/internal__plugin-state#StateType | state type} of the list items
 * @param initialCount - The initial number of list items
 * @public
 */
export function list<S, T = S, U = unknown>(
  type: StateType<S, T, U>,
  initialCount = 0
): StateType<
  S[],
  {
    id: string
    value: T
  }[],
  U[] & {
    set(
      updater: (currentList: T[], deserialize: (serialized: S) => T) => T[]
    ): void
    insert(index?: number, options?: S): void
    remove(index: number): void
    move(from: number, to: number): void
  }
> {
  interface WrappedValue {
    id: string
    value: T
  }

  return {
    init(rawItems, onChange, pluginProps) {
      const items = rawItems.map(item => {
        return type.init(item.value, createOnChange(item.id), pluginProps)
      })

      return Object.assign(items, {
        set(
          updater: (currentList: T[], deserialize: (serialized: S) => T) => T[]
        ) {
          onChange((wrappedItems, helpers) => {
            const unwrapped = R.map(wrapped => wrapped.value, wrappedItems)
            return R.map(
              wrap,
              updater(unwrapped, options => type.deserialize(options, helpers))
            )
          })
        },
        insert(index?: number, options?: S) {
          onChange((items, helpers) => {
            const wrappedSubState = wrap(
              options
                ? type.deserialize(options, helpers)
                : type.createInitialState(helpers)
            )
            return R.insert(
              index === undefined ? items.length : index,
              wrappedSubState,
              items
            )
          })
        },
        remove(index: number) {
          onChange(items => R.remove(index, 1, items))
        },
        move(from: number, to: number) {
          onChange(items => R.move(from, to, items))
        }
      })

      function createOnChange(id: string) {
        return (
          initial: StateUpdater<T>,
          executor?: StateExecutor<StateUpdater<T>>
        ) => {
          function wrapUpdater(
            initial: StateUpdater<T>
          ): StateUpdater<WrappedValue[]> {
            return (
              oldItems: WrappedValue[],
              helpers: StoreDeserializeHelpers
            ) => {
              const index = R.findIndex(R.propEq('id', id), oldItems)
              const result = R.update(
                index,
                { value: initial(oldItems[index].value, helpers), id: id },
                oldItems
              )
              return result
            }
          }
          onChange(
            wrapUpdater(initial),
            executor
              ? (resolve, reject, next) => {
                  executor(
                    innerUpdater => resolve(wrapUpdater(innerUpdater)),
                    innerUpdater => reject(wrapUpdater(innerUpdater)),
                    innerUpdater => next(wrapUpdater(innerUpdater))
                  )
                }
              : undefined
          )
        }
      }
    },
    createInitialState(helpers) {
      return R.times(() => {
        return wrap(type.createInitialState(helpers))
      }, initialCount)
    },
    deserialize(serialized, helpers) {
      return R.map(s => {
        return wrap(type.deserialize(s, helpers))
      }, serialized)
    },
    serialize(deserialized, helpers) {
      return R.map(({ value }) => {
        return type.serialize(value, helpers)
      }, deserialized)
    },
    getFocusableChildren(items) {
      return R.flatten(
        R.map(item => {
          return type.getFocusableChildren(item.value)
        }, items)
      )
    }
  }

  function wrap(value: T): WrappedValue {
    return {
      id: generate(),
      value
    }
  }
}
