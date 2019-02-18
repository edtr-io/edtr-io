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
export function child(
  options: {
    plugin?: string
    state?: unknown
  } = {}
) {
  return function(...args: PluginStateParameters<DocumentIdentifier>) {
    return scalar(createDocument(options))(...args)
  }
}

/**
 * Represents a value of type T
 * @param initialValue
 */
export function scalar<T>(initialValue: T) {
  return function(
    ...[rawState, onChange]: PluginStateParameters<T>
  ): {
    value: T
    set: (value: T | ((currentValue: T) => T)) => void
  } {
    const value = rawState == undefined ? initialValue : rawState

    return {
      value,
      set(param: T | ((currentValue: T) => T)) {
        if (typeof param === 'function') {
          onChange((param as ((currentValue: T) => T))(value))
        } else {
          onChange(param)
        }
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
export function list<T, Return extends { value: T }>(
  type: PluginStateDescriptor<T, Return>,
  initialCount = 0
) {
  return function(
    ...[rawState, onChange]: PluginStateParameters<T[]>
  ): {
    items: Return[]
    insert: (index: number) => void
    remove: (index: number) => void
  } {
    const rs =
      rawState === undefined
        ? R.times(() => getInitialValue(), initialCount)
        : rawState
    const items = rs.map((s, index) => {
      return type(s, createOnChange(index))
    })
    return {
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
        return R.times(() => getInitialValue(), initialCount)
      }
      return list
    }
  }

  function getInitialValue() {
    return type(undefined, () => {}).value
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
    ...[rawState, onChange]: PluginStateParameters<
      PluginStateDescriptorsValueType<Ds>
    >
  ): PluginStateDescriptorsReturnType<Ds> {
    const rs: PluginStateDescriptorsValueType<Ds> =
      rawState === undefined ? R.map(() => undefined, types) : rawState

    return R.mapObjIndexed((s, key: keyof Ds) => {
      return types[key](s, createOnChange(key))
    }, rs) as PluginStateDescriptorsReturnType<Ds>

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
              ? R.map(type => type(undefined, () => {}).value, types)
              : current
          )
        })
      }
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PluginStateDescriptor<T = any, R = any> = (
  ...args: PluginStateParameters<T>
) => R

export type PluginStateParameters<T> = [
  T | undefined,
  (value: T | ((currentValue: T | undefined) => T)) => void
]

export type PluginStateDescriptorValueType<
  D extends PluginStateDescriptor
> = D extends PluginStateDescriptor<infer T> ? T : never

export type PluginStateDescriptorReturnType<
  D extends PluginStateDescriptor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = D extends PluginStateDescriptor<any, infer R> ? R : never

export type PluginStateDescriptorsValueType<
  Ds extends Record<string, PluginStateDescriptor>
> = { [K in keyof Ds]: PluginStateDescriptorValueType<Ds[K]> | undefined }

export type PluginStateDescriptorsReturnType<
  Ds extends Record<string, PluginStateDescriptor>
> = { [K in keyof Ds]: PluginStateDescriptorReturnType<Ds[K]> }
