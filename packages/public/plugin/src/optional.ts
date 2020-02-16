import { StateExecutor, StateType, StateUpdater } from './internal-plugin-state'

/**
 * @param type - The {@link @edtr-io/internal__plugin-state#StateType | state type} for defined values
 * @param initiallyDefined - Whether the value should be defined initially
 * @public
 */
export function optional<S, T, R>(
  type: StateType<S, T, R>,
  initiallyDefined = false
): OptionalStateType<S, T, R> {
  return {
    init(state, onChange) {
      if (state.defined) {
        const value = type.init(state.value, innerOnChange)
        return Object.assign(value, {
          defined: true,
          remove() {
            onChange(() => {
              return {
                defined: false,
                value: null
              }
            })
          }
        }) as R & { defined: true; remove(): void }
      }

      return {
        defined: false,
        create(value) {
          onChange((_previousState, helpers) => {
            return {
              defined: true,
              value:
                value === undefined
                  ? type.createInitialState(helpers)
                  : type.deserialize(value, helpers)
            }
          })
        }
      }

      function innerOnChange(
        initial: StateUpdater<T>,
        executor?: StateExecutor<StateUpdater<T>>
      ) {
        return onChange(
          wrapStateUpdater(initial),
          typeof executor === 'function'
            ? (resolve, reject, next) => {
                executor(
                  value => {
                    resolve(wrapStateUpdater(value))
                  },
                  value => {
                    reject(wrapStateUpdater(value))
                  },
                  value => {
                    next(wrapStateUpdater(value))
                  }
                )
              }
            : undefined
        )
      }

      function wrapStateUpdater(f: StateUpdater<T>): StateUpdater<Optional<T>> {
        return (previousState, helpers) => {
          if (previousState.defined) {
            return {
              defined: true,
              value: f(previousState.value, helpers)
            }
          } else {
            return {
              defined: true,
              value: f(type.createInitialState(helpers), helpers)
            }
          }
        }
      }
    },
    createInitialState(helpers) {
      if (initiallyDefined) {
        return {
          defined: true,
          value: type.createInitialState(helpers)
        }
      }
      return {
        defined: false,
        value: null
      }
    },
    deserialize(serialized, helpers) {
      if (serialized === undefined) {
        return {
          defined: false,
          value: null
        }
      }

      return {
        defined: true,
        value: type.deserialize(serialized, helpers)
      }
    },
    serialize(deserialized, helpers) {
      if (deserialized.defined) {
        return type.serialize(deserialized.value, helpers)
      }
      return undefined
    },
    getFocusableChildren(state) {
      if (state.defined) return type.getFocusableChildren(state.value)
      return []
    }
  }
}

/** @public */
export type OptionalStateType<S, T, R> = StateType<
  S | undefined,
  Optional<T>,
  | { defined: false; create(value?: S): void }
  | (R & { defined: true; remove(): void })
>

/** @public */
export type Optional<T> =
  | {
      defined: true
      value: T
    }
  | {
      defined: false
      value: null
    }
