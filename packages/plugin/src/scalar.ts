import {
  StoreDeserializeHelpers,
  StateType
} from '@edtr-io/abstract-plugin-state'

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
  return class SerializedScalarType {
    constructor(
      protected _value: T,
      protected onChange: (
        updater: (oldValue: T, helpers: StoreDeserializeHelpers) => T
      ) => void
    ) {}

    public static createInitialState() {
      return initialState
    }
    public static deserialize(serialized: S) {
      return serializer.deserialize(serialized)
    }
    public static serialize(deserialized: T) {
      return serializer.serialize(deserialized)
    }

    public get value(): T {
      return this._value
    }

    public set value(param: T) {
      this.set(param)
    }

    public get = () => {
      return this._value
    }

    public set = (param: T | ((currentValue: T) => T)) => {
      this.onChange((currentValue: T) => {
        if (typeof param === 'function') {
          const updater = param as ((currentValue: T) => T)
          return updater(currentValue)
        } else {
          return param
        }
      })
    }
  }
}

export interface Serializer<S, T> {
  deserialize(serialized: S): T
  serialize(deserialized: T): S
}
