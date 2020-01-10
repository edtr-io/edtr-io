/**
 * @module @edtr-io/plugin
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import {
  StateExecutor,
  StateType,
  StateUpdater
} from '@edtr-io/internal__plugin-state'

export function boolean(initialValue?: boolean) {
  return scalar<boolean>(initialValue || false)
}

export function number(initialValue?: number) {
  return scalar<number>(initialValue || 0)
}

export function string(initialValue?: string) {
  return scalar<string>(initialValue || '')
}

export function scalar<S>(initialState: S) {
  return serializedScalar<S, S>(initialState, {
    deserialize(state) {
      return state
    },
    serialize(state) {
      return state
    }
  })
}

export function asyncScalar<T, Temp>(
  initial: T,
  isTemporaryValue: (field: T | Temp) => boolean
): StateType<
  T,
  T | Temp,
  {
    value: T | Temp
    get(): T | Temp
    set(
      initial: T | Temp | ((previousValue: T | Temp) => T | Temp),
      executor?: StateExecutor<
        T | Temp | ((previousValue: T | Temp) => T | Temp)
      >
    ): void
  }
> {
  // warp boolean to typeguard
  function isTemporary(field: T | Temp): field is Temp {
    return isTemporaryValue(field)
  }

  return {
    init(state, onChange) {
      return {
        value: state,
        get() {
          return state
        },
        set(initial, executor) {
          onChange(
            previousState => {
              if (typeof initial === 'function') {
                const f = initial as (previous: T | Temp) => T | Temp
                return f(previousState)
              }
              return initial
            },
            {
              executor: executor
                ? (
                    resolve: (updater: StateUpdater<T | Temp>) => void,
                    reject: (updater: StateUpdater<T | Temp>) => void,
                    next: (updater: StateUpdater<T | Temp>) => void
                  ) => {
                    if (!executor) return

                    executor(
                      wrapResolverParam(resolve),
                      wrapResolverParam(reject),
                      wrapResolverParam(next)
                    )
                  }
                : undefined
            }
          )
        }
      }
      function wrapResolverParam(
        callback: (updater: StateUpdater<T | Temp>) => void
      ): (updater: T | Temp | ((previousValue: T | Temp) => T | Temp)) => void {
        return update => {
          if (typeof update === 'function') {
            const f = update as (previous: T | Temp) => T | Temp
            return callback(f)
          }

          return callback(() => update)
        }
      }
    },
    createInitialState() {
      return initial
    },
    getFocusableChildren() {
      return []
    },
    deserialize(serialized) {
      return serialized
    },
    serialize(deserialized) {
      if (isTemporary(deserialized)) {
        return initial
      }
      return deserialized
    }
  }
}

export function serializedScalar<S, T>(
  initialState: T,
  serializer: Serializer<S, T>
): StateType<
  S,
  T,
  {
    value: T
    get(): T
    set(
      value: T | ((currentValue: T) => T),
      reverse?: (previousValue: T) => T
    ): void
  }
> {
  return {
    init(state, onChange) {
      class SerializedScalarType {
        public get value(): T {
          return state
        }
        public set value(param: T) {
          this.set(param)
        }
        public get() {
          return state
        }
        public set(
          param: T | ((previousValue: T) => T),
          reverse?: (previousValue: T) => T
        ) {
          onChange(
            previousValue => {
              if (typeof param === 'function') {
                const updater = param as (currentValue: T) => T
                return updater(previousValue)
              }
              return param
            },
            {
              reverse
            }
          )
        }
      }
      return new SerializedScalarType()
    },
    createInitialState() {
      return initialState
    },
    getFocusableChildren() {
      return []
    },
    ...serializer
  }
}

export interface Serializer<S, T> {
  deserialize(serialized: S): T
  serialize(deserialized: T): S
}
