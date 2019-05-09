import * as R from 'ramda'
import {
  StateDescriptorsReturnType,
  StateDescriptorsValueType,
  StateDescriptor,
  StoreDeserializeHelpers,
  StoreSerializeHelpers,
  StateDescriptorReturnType,
  StateDescriptorsSerializedType
} from './types'

export function object<Ds extends Record<string, StateDescriptor>>(
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
