/**
 * @module @edtr-io/plugin
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import {
  StateExecutor,
  StateType,
  StateUpdater,
  StoreDeserializeHelpers
} from '@edtr-io/internal__plugin-state'
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
  U[] & {
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
          {
            executor,
            reverse
          }: {
            executor?: StateExecutor<StateUpdater<T>>
            reverse?: (previousState: T) => T
          } = {}
        ) => {
          function wrapReverse(
            reverse: (previousState: T) => T
          ): (previousState: WrappedValue[]) => WrappedValue[] {
            return oldItems => {
              const index = R.findIndex(R.propEq('id', id), oldItems)
              return R.update(
                index,
                { value: reverse(oldItems[index].value), id: id },
                oldItems
              )
            }
          }

          function wrapUpdater(
            initial: StateUpdater<T>
          ): StateUpdater<WrappedValue[]> {
            return (
              oldItems: WrappedValue[],
              helpers: StoreDeserializeHelpers
            ) => {
              const index = R.findIndex(R.propEq('id', id), oldItems)
              return R.update(
                index,
                { value: initial(oldItems[index].value, helpers), id: id },
                oldItems
              )
            }
          }
          onChange(wrapUpdater(initial), {
            executor: executor
              ? (resolve, reject, next) => {
                  executor(
                    innerUpdater => resolve(wrapUpdater(innerUpdater)),
                    innerUpdater => reject(wrapUpdater(innerUpdater)),
                    innerUpdater => next(wrapUpdater(innerUpdater))
                  )
                }
              : undefined,
            reverse: reverse ? wrapReverse(reverse) : undefined
          })
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
