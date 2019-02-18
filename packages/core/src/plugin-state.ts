import * as R from 'ramda'

import { createDocument, DocumentIdentifier } from '.'

/**
 * Represents a boolean value
 * @param initialValue
 */
export function boolean(initialValue = false) {
  return scalar(initialValue)
}

/**
 * Represents a number value
 * @param initialValue
 */
export function number(initialValue = 0) {
  return scalar(initialValue)
}

/**
 * Represents a sub document
 */
export function child(options: { plugin?: string; state?: string } = {}) {
  const serialize = (
    value: DocumentIdentifier
  ): { $$typeof: '@edtr-io/document'; id: string; plugin?: string } => {
    return {
      $$typeof: '@edtr-io/document',
      ...value
    }
  }
  const deserialize = (value: {
    id: string
    plugin?: string
  }): DocumentIdentifier => {
    return createDocument(value)
  }

  return function(
    ...[s, rawState]: PluginStateParameters<
      DocumentIdentifier,
      { $$typeof: '@edtr-io/document'; id: string }
    >
  ): {
    $$value: DocumentIdentifier
    value: { id: string; plugin?: string }
  } {
    const initial: DocumentIdentifier =
      s === undefined ? createDocument(options) : s
    const serialized: {
      $$typeof: '@edtr-io/document'
      id: string
      plugin?: string
    } = rawState === undefined ? serialize(initial) : rawState
    const value = rawState === undefined ? initial : deserialize(rawState)

    return {
      $$value: serialized,
      value
    }
  }
}

/**
 * Represents a value of type T
 * @param initialValue
 */
export function scalar<T>(initialValue: T) {
  return serializedScalar(initialValue, {
    serialize: R.identity,
    deserialize: R.identity
  })
}

/**
 * Represents a value of type T that the editor persists as a value of type S
 * @param initialValue
 * @param serializer
 */
export function serializedScalar<T, S = T>(
  initialValue: T,
  serializer: {
    deserialize: (value: S) => T
    serialize: (value: T) => S
  }
) {
  return function(
    ...[s, rawState, onChange]: PluginStateParameters<T, S>
  ): {
    $$value: S
    value: T
    set: (value: T | ((currentValue: T) => T)) => void
  } {
    const initial: T = s === undefined ? initialValue : s
    const serialized: S =
      rawState === undefined ? serializer.serialize(initial) : rawState
    const value =
      rawState === undefined ? initial : serializer.deserialize(rawState)

    return {
      $$value: serialized,
      value,
      set(param: T | ((currentValue: T) => T)) {
        let state: T
        if (typeof param === 'function') {
          const f = param as ((currentValue: T) => T)
          state = f(value)
        } else {
          state = param
        }
        onChange(serializer.serialize(state))
      }
    }
  }
}

/**
 * Represents a list
 * @param type state descriptor for the elements of the list
 * @param initialCount initial length of the list
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function list(type: PluginStateDescriptor, initialCount = 0) {
  type S = PluginStateDescriptorSerializedValueType<typeof type>
  type T = PluginStateDescriptorValueType<typeof type>

  return function(
    ...[serialized, rawState, onChange]: PluginStateParameters<T[], S[]>
  ): {
    $$value: S[]
    items: (PluginStateDescriptorReturnType<typeof type>)[]
    insert: (index: number) => void
    remove: (index: number) => void
  } {
    let rs: PluginStateDescriptorSerializedValueType<typeof type>[]

    if (rawState === undefined) {
      if (serialized === undefined) {
        rs = R.times(index => {
          return type(undefined, undefined, createOnChange(index)).$$value
        }, initialCount)
      } else {
        rs = R.times(index => {
          return type(serialized[index], undefined, createOnChange(index))
            .$$value
        }, serialized.length)
      }
    } else {
      rs = rawState
    }

    const items = rs.map((s, index) => {
      const initial = serialized === undefined ? undefined : serialized[index]
      return type(initial, s, createOnChange(index))
    })
    return {
      $$value: items.map(item => item.$$value),
      items,
      insert(index: number) {
        onChange(currentList => {
          return R.insert(index, getInitialValue(), initList(currentList))
        })
      },
      remove(index: number) {
        onChange(currentList => {
          return R.remove(index, 1, initList(currentList))
        })
      }
    }

    function createOnChange(index: number) {
      return function(param: T | ((currentValue: T | undefined) => T)) {
        let value: T
        if (typeof param === 'function') {
          const f = param as ((currentValue: T | undefined) => T)
          value = f(rawState === undefined ? undefined : rawState[index])
        } else {
          value = param
        }
        onChange(currentList => {
          return R.update(index, value, initList(currentList))
        })
      }
    }

    function initList(list: T[] | undefined): T[] {
      if (list === undefined) {
        return R.times(index => getInitialValue(index), initialCount)
      }
      return list
    }

    function getInitialValue(index?: number) {
      const initial =
        index === undefined || serialized === undefined
          ? undefined
          : serialized[index]
      return type(initial, undefined, () => {}).$$value
    }
  }
}

/**
 * Represents an object
 * @param types state descriptors for the properties of the object
 */
export function object<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Ds extends Record<string, PluginStateDescriptor>
>(types: Ds) {
  return function(
    ...[serialized, rawState, onChange]: PluginStateParameters<
      PluginStateDescriptorsValueType<Ds>,
      PluginStateDescriptorsSerializedValueType<Ds>
    >
  ): {
    $$value: PluginStateDescriptorsSerializedValueType<Ds>
    value: PluginStateDescriptorsReturnType<Ds>
  } {
    const rs =
      rawState === undefined
        ? (R.mapObjIndexed((type, key) => {
            const initial =
              serialized === undefined ? undefined : serialized[key]

            return type(initial, undefined, createOnChange(key)).$$value
          }, types) as PluginStateDescriptorsSerializedValueType<Ds>)
        : rawState

    const value = R.mapObjIndexed((s, key: keyof Ds) => {
      const initial = serialized === undefined ? undefined : serialized[key]
      return types[key](initial, s, createOnChange(key))
    }, rs) as PluginStateDescriptorsReturnType<Ds>

    return {
      $$value: R.mapObjIndexed(
        value => value.$$value,
        value
      ) as PluginStateDescriptorsSerializedValueType<Ds>,
      value
    }

    function createOnChange<K extends keyof Ds>(key: K) {
      type T = PluginStateDescriptorValueType<Ds[K]>

      return function(param: T | ((currentValue: T | undefined) => T)) {
        let value: T
        if (typeof param === 'function') {
          const f = param as ((currentValue: T | undefined) => T)
          value = f(rawState === undefined ? undefined : rawState[key])
        } else {
          value = param
        }
        onChange(current => {
          return R.assoc(
            key as string,
            value,
            current === undefined
              ? (R.mapObjIndexed((type, key) => {
                  const initial =
                    serialized === undefined ? undefined : serialized[key]
                  return type(initial, undefined, createOnChange(key)).$$value
                }, types) as PluginStateDescriptorsSerializedValueType<Ds>)
              : current
          )
        })
      }
    }
  }
}

export type PluginStateDescriptor<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T = any,
  S = T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  R extends { $$value: S } = any
> = (...args: PluginStateParameters<T, S>) => R

export type PluginStateParameters<T, S> = [
  T | undefined,
  S | undefined,
  (value: S | ((currentValue: S | undefined) => S)) => void
]

export type PluginStateDescriptorValueType<
  D extends PluginStateDescriptor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = D extends PluginStateDescriptor<infer T, any> ? T : never

export type PluginStateDescriptorSerializedValueType<
  D extends PluginStateDescriptor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = D extends PluginStateDescriptor<any, infer S> ? S : never

export type PluginStateDescriptorReturnType<
  D extends PluginStateDescriptor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = D extends PluginStateDescriptor<any, any, infer R> ? R : never

export type PluginStateDescriptorsValueType<
  Ds extends Record<string, PluginStateDescriptor>
> = { [K in keyof Ds]: PluginStateDescriptorValueType<Ds[K]> | undefined }

export type PluginStateDescriptorsSerializedValueType<
  Ds extends Record<string, PluginStateDescriptor>
> = {
  [K in keyof Ds]: PluginStateDescriptorSerializedValueType<Ds[K]> | undefined
}

export type PluginStateDescriptorsReturnType<
  Ds extends Record<string, PluginStateDescriptor>
> = { [K in keyof Ds]: PluginStateDescriptorReturnType<Ds[K]> }
