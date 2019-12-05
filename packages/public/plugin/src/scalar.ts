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

interface Temporary<T> {
  tmp: T
}

function isTemporary<T>(field: unknown | Temporary<T>): field is Temporary<T> {
  return typeof (field as Temporary<T>).tmp !== 'undefined'
}

export function asyncScalar<S, T, Temp>(
  initial: AsyncResolver<T | Temporary<Temp>>,
  serializer: Serializer<S, T | Temporary<Temp>>
): StateType<
  S,
  T | Temporary<Temp>,
  {
    value: T | Temporary<Temp>
    get(): T | Temporary<Temp>
    set(
      async: AsyncResolver<
        | T
        | Temporary<Temp>
        | ((previousValue: T | Temporary<Temp>) => T | Temporary<Temp>)
      >
    ): void
    isTemporary(): boolean
  }
> {
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
                const f = async.immediate as ((
                  previous: T | Temporary<Temp>
                ) => T | Temporary<Temp>)
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
        },
        isTemporary() {
          return isTemporary(state)
        }
      }
      function wrapResolverParam(
        callback: (updater: Updater<T | Temporary<Temp>>) => void
      ): (
        updater:
          | T
          | Temporary<Temp>
          | ((previousValue: T | Temporary<Temp>) => T | Temporary<Temp>)
      ) => void {
        return update => {
          if (typeof update === 'function') {
            const f = update as ((
              previous: T | Temporary<Temp>
            ) => T | Temporary<Temp>)
            return callback(f)
          }

          return callback(() => update)
        }
      }
    },
    createInitialState() {
      return initial.immediate
    },
    getFocusableChildren() {
      return []
    },
    ...serializer
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
