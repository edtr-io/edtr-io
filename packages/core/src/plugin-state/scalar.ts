import * as R from 'ramda'
import { StateDescriptor, StoreDeserializeHelpers } from './types'

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
    deserialize: R.identity,
    serialize: R.identity
  })
}

export function serializedScalar<S, T>(
  initialState: T,
  serializer: {
    deserialize: (serialized: S) => T
    serialize: (deserialized: T) => S
  }
): StateDescriptor<
  S,
  T,
  {
    (): T
    value: T
    set(value: T | ((currentValue: T) => T)): void
  }
> {
  return Object.assign(
    (
      value: T,
      onChange: (
        updater: (oldValue: T, helpers: StoreDeserializeHelpers) => T
      ) => void
    ) => {
      return Object.assign(() => value, {
        value,
        set(param: T | ((currentValue: T) => T)) {
          onChange((currentValue: T) => {
            if (typeof param === 'function') {
              const updater = param as ((currentValue: T) => T)
              return updater(currentValue)
            } else {
              return param
            }
          })
        }
      })
    },
    {
      createInitialState: () => initialState,
      deserialize(serialized: S) {
        return serializer.deserialize(serialized)
      },
      serialize(deserialized: T) {
        return serializer.serialize(deserialized)
      }
    }
  )
}
