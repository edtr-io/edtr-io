import { StateDescriptor, StoreDeserializeHelpers } from './types'

export function async<S, T = S, R = unknown>(
  type: StateDescriptor<S, T, R>,
  asyncInitialState: Promise<S>
): StateDescriptor<S, T, R> {
  return Object.assign(
    (
      value: T,
      onChange: (
        updater: (currentValue: T, helpers: StoreDeserializeHelpers) => T
      ) => void
    ) => {
      return type(value, onChange)
    },
    {
      createInitialState(helpers: StoreDeserializeHelpers) {
        const initialState = type.createInitialState(helpers)
        return {
          immediateState: initialState.immediateState,
          asyncState: asyncInitialState.then(resolvedSerialized =>
            type.deserialize(resolvedSerialized, helpers)
          )
        }
      },
      deserialize: type.deserialize,
      serialize: type.serialize
    }
  )
}
