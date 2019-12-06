/**
 * @module @edtr-io/plugin
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import {
  AsyncResolver,
  StateType,
  Updater
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
      async: AsyncResolver<T | Temp | ((previousValue: T | Temp) => T | Temp)>
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
        set(async) {
          onChange({
            immediate: previousState => {
              if (typeof async.immediate === 'function') {
                const f = async.immediate as ((previous: T | Temp) => T | Temp)
                return f(previousState)
              } else {
                return async.immediate
              }
            },
            ...(async.resolver
              ? {
                  resolver: (resolve, reject, next) => {
                    if (!async.resolver) return

                    async.resolver(
                      wrapResolverParam(resolve),
                      wrapResolverParam(reject),
                      wrapResolverParam(next)
                    )
                  }
                }
              : {})
          })
        }
      }
      function wrapResolverParam(
        callback: (updater: Updater<T | Temp>) => void
      ): (updater: T | Temp | ((previousValue: T | Temp) => T | Temp)) => void {
        return update => {
          if (typeof update === 'function') {
            const f = update as ((previous: T | Temp) => T | Temp)
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
    set(value: T | ((currentValue: T) => T)): void
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
        public set(param: T | ((previousValue: T) => T)) {
          onChange({
            immediate: previousValue => {
              if (typeof param === 'function') {
                const updater = param as ((currentValue: T) => T)
                return updater(previousValue)
              }
              return param
            }
          })
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
