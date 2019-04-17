import { StateDescriptor, StoreDeserializeHelpers } from './types'
import { AsyncState } from '../plugin'

export function async<S, T = S, R = unknown>(
  type: StateDescriptor<S, T, R>,
  asyncInitialState?: Promise<S>
): StateDescriptor<S | Promise<S>, T, R> {
  return Object.assign(
    (
      value: T,
      onChange: (
        updater: (
          currentValue: T,
          helpers: StoreDeserializeHelpers
        ) => AsyncState<T>
      ) => void
    ) => {
      return type(value, onChange)
    },
    {
      createInitialState(helpers: StoreDeserializeHelpers) {
        const initialState = type.createInitialState(helpers)
        return {
          immediateState: initialState.immediateState,
          asyncState: asyncInitialState
            ? asyncInitialState.then(
                resolvedSerialized =>
                  type.deserialize(resolvedSerialized, helpers).immediateState
              )
            : undefined
        }
      },
      deserialize: (
        serialized: S | Promise<S>,
        helpers: StoreDeserializeHelpers
      ) => {
        if (isPromise(serialized)) {
          return {
            immediateState: type.createInitialState(helpers).immediateState,
            asyncState: serialized.then(
              resolvedSerialized =>
                type.deserialize(resolvedSerialized, helpers).immediateState
            )
          }
        }

        return type.deserialize(serialized, helpers)
      },
      serialize: type.serialize
    }
  )

  function isPromise(value: S | Promise<S>): value is Promise<S> {
    return Promise.resolve(value) === value
  }
}
