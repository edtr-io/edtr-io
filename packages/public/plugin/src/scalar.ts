/**
 * @module @edtr-io/plugin
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { StateType } from '@edtr-io/internal__plugin-state'

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
          onChange(previousValue => {
            if (typeof param === 'function') {
              const updater = param as ((currentValue: T) => T)
              return updater(previousValue)
            }
            return param
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
