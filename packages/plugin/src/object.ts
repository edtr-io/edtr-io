import {
  StateDescriptorsReturnType,
  StateDescriptorsValueType,
  StateDescriptor,
  StoreDeserializeHelpers,
  StoreSerializeHelpers,
  StateDescriptorReturnType,
  StateDescriptorsSerializedType,
  StateType,
  StateTypesSerializedType,
  StateTypesValueType,
  StateTypesReturnType,
  StateTypeReturnType
} from '@edtr-io/abstract-plugin-state'
import * as R from 'ramda'

export function object<Ds extends Record<string, StateType>>(
  types: Ds
): StateType<
  StateTypesSerializedType<Ds>,
  StateTypesValueType<Ds>,
  StateTypesReturnType<Ds>
> {
  type S = StateTypesSerializedType<Ds>
  type T = StateTypesValueType<Ds>
  type U = StateTypesReturnType<Ds>

  class ObjectType {
    [key: string]: StateTypeReturnType<StateType>
    public __types: U
    constructor(
      value: T,
      onChange: (
        updater: (oldValue: T, helpers: StoreDeserializeHelpers) => T
      ) => void,
      pluginProps?: unknown
    ) {
      this.__types = R.mapObjIndexed((type, key) => {
        function innerOnChange(
          updater: (
            oldValue: StateTypeReturnType<typeof type>,
            helpers: StoreDeserializeHelpers
          ) => StateTypeReturnType<typeof type>
        ): void {
          onChange((oldObj, helpers) =>
            R.set(R.lensProp(key), updater(oldObj[key], helpers), oldObj)
          )
        }
        return new type(value[key], innerOnChange, pluginProps)
      }, types) as U

      R.forEachObjIndexed((type, key) => {
        this[key as string] = type
      }, this.__types)
    }

    static createInitialState(helpers: StoreDeserializeHelpers) {
      return R.map(type => {
        return type.createInitialState(helpers)
      }, types) as T
    }
    static deserialize(serialized: S, helpers: StoreDeserializeHelpers) {
      return R.mapObjIndexed((type, key) => {
        return type.deserialize(serialized[key], helpers)
      }, types) as T
    }
    static serialize(deserialized: T, helpers: StoreSerializeHelpers) {
      return R.mapObjIndexed((type, key) => {
        return type.serialize(deserialized[key], helpers)
      }, types) as S
    }
  }

  return ObjectType as StateType<
    StateTypesSerializedType<Ds>,
    StateTypesValueType<Ds>,
    StateTypesReturnType<Ds>
  >
}

/** @deprecated */
export function legacyObject<Ds extends Record<string, StateDescriptor>>(
  types: Ds
): StateDescriptor<
  StateDescriptorsSerializedType<Ds>,
  StateDescriptorsValueType<Ds>,
  {
    (): StateDescriptorsReturnType<Ds>
  } & StateDescriptorsReturnType<Ds>
> {
  type S = StateDescriptorsSerializedType<Ds>
  type T = StateDescriptorsValueType<Ds>
  type U = StateDescriptorsReturnType<Ds>
  return Object.assign(
    (
      initialValue: T,
      onChange: (
        updater: (oldValue: T, helpers: StoreDeserializeHelpers) => T
      ) => void,
      parentProps?: unknown
    ) => {
      const getObject = (): U =>
        R.mapObjIndexed((type, key) => {
          function innerOnChange(
            updater: (
              oldValue: StateDescriptorReturnType<typeof type>,
              helpers: StoreDeserializeHelpers
            ) => StateDescriptorReturnType<typeof type>
          ): void {
            onChange((oldObj, helpers) =>
              R.set(R.lensProp(key), updater(oldObj[key], helpers), oldObj)
            )
          }
          return type(initialValue[key], innerOnChange, parentProps)
        }, types) as U

      return Object.assign(getObject, getObject())
    },
    {
      createInitialState(helpers: StoreDeserializeHelpers): T {
        return R.map(type => {
          return type.createInitialState(helpers)
        }, types) as T
      },
      deserialize(serialized: S, helpers: StoreDeserializeHelpers): T {
        return R.mapObjIndexed((type, key) => {
          return type.deserialize(serialized[key], helpers)
        }, types) as T
      },
      serialize(deserialized: T, helpers: StoreSerializeHelpers): S {
        return R.mapObjIndexed((type, key) => {
          return type.serialize(deserialized[key], helpers)
        }, types) as S
      }
    }
  )
}
