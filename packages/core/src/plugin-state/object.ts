import * as R from 'ramda'
import {
  StateDescriptorsReturnType,
  StateDescriptorsValueType,
  StateDescriptor,
  StoreDeserializeHelpers,
  StoreSerializeHelpers,
  StateDescriptorsSerializedType,
  StateDescriptorValueType
} from './types'
import { AsyncState } from '../plugin'

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
  type AsyncStates = {
    [K in keyof Ds]: AsyncState<StateDescriptorValueType<Ds[K]>>
  }
  return Object.assign(
    (
      initialValue: T,
      onChange: (
        updater: (
          oldValue: T,
          helpers: StoreDeserializeHelpers
        ) => AsyncState<T>
      ) => void
    ) => {
      const getObject = (): U =>
        R.mapObjIndexed((type, key) => {
          type InnerValueType = StateDescriptorValueType<typeof type>
          function innerOnChange(
            updater: (
              oldValue: InnerValueType,
              helpers: StoreDeserializeHelpers
            ) => AsyncState<InnerValueType>
          ): void {
            onChange((oldObj, helpers) => {
              const updatedValue = updater(oldObj[key], helpers)
              return {
                immediateState: updateValue(updatedValue.immediateState),
                asyncState: updatedValue.asyncState
                  ? updatedValue.asyncState.then(updateValue)
                  : undefined
              }
              function updateValue(value: InnerValueType) {
                return R.set(R.lensProp(key), value, oldObj)
              }
            })
          }
          return type(initialValue[key], innerOnChange)
        }, types) as U

      return Object.assign(getObject, getObject())
    },
    {
      createInitialState(helpers: StoreDeserializeHelpers) {
        const initialStates = R.mapObjIndexed(type => {
          return type.createInitialState(helpers)
        }, types) as AsyncStates
        return createAsyncState(initialStates)
      },
      deserialize(serialized: S, helpers: StoreDeserializeHelpers) {
        const deserializedStates = R.mapObjIndexed((type, key) => {
          return type.deserialize(serialized[key], helpers)
        }, types) as AsyncStates
        return createAsyncState(deserializedStates)
      },
      serialize(deserialized: T, helpers: StoreSerializeHelpers): S {
        return R.mapObjIndexed((type, key) => {
          return type.serialize(deserialized[key], helpers)
        }, types) as S
      }
    }
  )

  function createAsyncState(states: AsyncStates): AsyncState<T> {
    const immediateStates: T = R.map(s => s.immediateState, states)
    const state = {
      immediateState: immediateStates,
      asyncState: Promise.resolve(immediateStates)
    }
    R.forEachObjIndexed((initialState, key) => {
      if (initialState.asyncState) {
        state.asyncState = Promise.all([
          state.asyncState,
          initialState.asyncState
        ]).then(([resolvedObj, resolvedState]) => ({
          ...resolvedObj,
          [key]: resolvedState
        }))
      }
    }, states)
    return state
  }
}
