import {
  StateDescriptor,
  StoreDeserializeHelpers,
  StateType
} from '@edtr-io/abstract-plugin-state'

export function boolean(initialValue?: boolean) {
  return scalar<boolean>(initialValue || false)
}

/** @deprecated */
export function legacyBoolean(initialValue?: boolean) {
  return legacyScalar<boolean>(initialValue || false)
}

export function number(initialValue?: number) {
  return scalar<number>(initialValue || 0)
}

/** @deprecated */
export function legacyNumber(initialValue?: number) {
  return legacyScalar<number>(initialValue || 0)
}

export function string(initialValue?: string) {
  return scalar<string>(initialValue || '')
}

/** @deprecated */
export function legacyString(initialValue?: string) {
  return legacyScalar<string>(initialValue || '')
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

/** @deprecated */
export function legacyScalar<S>(initialState: S) {
  return legacySerializedScalar<S, S>(initialState, {
    deserialize: state => state,
    serialize: state => state
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

    static createInitialState() {
      return initialState
    }
    static deserialize(serialized: S) {
      return serializer.deserialize(serialized)
    }
    static serialize(deserialized: T) {
      return serializer.serialize(deserialized)
    }

    public get value(): T {
      return this._value
    }

    public set value(param: T) {
      this.set(param)
    }

    public get() {
      return this._value
    }

    public set(param: T | ((currentValue: T) => T)) {
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

/** @deprecated */
export function legacySerializedScalar<S, T>(
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
