import {
  StoreDeserializeHelpers,
  StoreSerializeHelpers,
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

    public static createInitialState(helpers: StoreDeserializeHelpers) {
      return R.map(type => {
        return type.createInitialState(helpers)
      }, types) as T
    }
    public static deserialize(serialized: S, helpers: StoreDeserializeHelpers) {
      return R.mapObjIndexed((type, key) => {
        return type.deserialize(serialized[key], helpers)
      }, types) as T
    }
    public static serialize(deserialized: T, helpers: StoreSerializeHelpers) {
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
