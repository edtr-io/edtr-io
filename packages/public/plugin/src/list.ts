/**
 * @module @edtr-io/plugin
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import {
  StoreDeserializeHelpers,
  StateType,
  StateUpdater,
  Updater
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
          onChange({
            immediate: (items, helpers) => {
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
            }
          })
        },
        remove(index: number) {
          onChange({ immediate: items => R.remove(index, 1, items) })
        },
        move(from: number, to: number) {
          onChange({ immediate: items => R.move(from, to, items) })
        }
      })

      function createOnChange(id: string) {
        return (stateUpdater: StateUpdater<T>) => {
          function wrapUpdater(updater: Updater<T>): Updater<WrappedValue[]> {
            return (
              oldItems: WrappedValue[],
              helpers: StoreDeserializeHelpers
            ) => {
              console.log(oldItems)
              const index = R.findIndex(R.propEq('id', id), oldItems)
              const result = R.update(
                index,
                { value: updater(oldItems[index].value, helpers), id: id },
                oldItems
              )
              console.log('result: ', result)
              return result
            }
          }
          onChange({
            immediate: wrapUpdater(stateUpdater.immediate),
            resolver: (resolve, reject, next) => {
              console.log('list resolver', stateUpdater.resolver)
              if (!stateUpdater.resolver) {
                resolve(wrapUpdater(stateUpdater.immediate))
              } else {
                stateUpdater.resolver(
                  innerUpdater => {
                    console.log('resolve list'),
                      resolve(wrapUpdater(innerUpdater))
                  },
                  innerUpdater => {
                    console.log('reject list'),
                      reject(wrapUpdater(innerUpdater))
                  },
                  innerUpdater => {
                    console.log('next list'), next(wrapUpdater(innerUpdater))
                  }
                )
              }
            }
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
