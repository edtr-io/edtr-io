import * as R from 'ramda'

import {
  StateType,
  StateTypesSerializedType,
  StateTypesValueType,
  StateTypesReturnType,
  StateTypeReturnType,
  FocusableChild,
  StateUpdater,
  StateExecutor,
} from './internal-plugin-state'

/**
 * @param types - The {@link @edtr-io/internal__plugin-state#StateType | state types} of the properties of the object
 * @param getFocusableChildren - Allows to override the default order of focusable children
 * @public
 */
export function object<Ds extends Record<string, StateType>>(
  types: Ds,
  getFocusableChildren: (children: { [K in keyof Ds]: { id: string }[] }) => {
    id: string
  }[] = (children) => {
    return R.flatten<readonly FocusableChild[][]>(R.values(children))
  }
): ObjectStateType<Ds> {
  type S = StateTypesSerializedType<Ds>
  type T = StateTypesValueType<Ds>
  type U = StateTypesReturnType<Ds>

  return {
    init(state, onChange) {
      return R.mapObjIndexed((type, key) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return type.init(state[key], innerOnChange)

        function innerOnChange(
          initial: StateUpdater<StateTypeReturnType<typeof type>>,
          {
            executor,
            reverse,
          }: {
            executor?: StateExecutor<
              StateUpdater<StateTypeReturnType<typeof type>>
            >
            reverse?: (
              previousState: StateTypeReturnType<typeof type>
            ) => StateTypeReturnType<typeof type>
          } = {}
        ): void {
          function wrapReverse(
            reverse: (
              previousState: StateTypeReturnType<typeof type>
            ) => StateTypeReturnType<typeof type>
          ): (
            previousState: StateTypesValueType<Ds>
          ) => StateTypesValueType<Ds> {
            return (oldObj) => {
              return R.set(R.lensProp(key), reverse(oldObj[key]), oldObj)
            }
          }

          function wrapUpdater(
            initial: StateUpdater<StateTypeReturnType<typeof type>>
          ): StateUpdater<StateTypesValueType<Ds>> {
            return (oldObj, helpers) => {
              return R.set(
                R.lensProp(key),
                initial(oldObj[key], helpers),
                oldObj
              )
            }
          }
          onChange(wrapUpdater(initial), {
            executor: executor
              ? (resolve, reject, next) => {
                  executor(
                    (innerUpdater) => resolve(wrapUpdater(innerUpdater)),
                    (innerUpdater) => reject(wrapUpdater(innerUpdater)),
                    (innerUpdater) => next(wrapUpdater(innerUpdater))
                  )
                }
              : undefined,
            reverse: reverse ? wrapReverse(reverse) : undefined,
          })
        }
      }, types) as U
    },
    createInitialState(helpers) {
      return R.map((type) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return type.createInitialState(helpers)
      }, types) as T
    },
    deserialize(serialized, helpers) {
      return R.mapObjIndexed((type, key) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return type.deserialize(serialized[key], helpers)
      }, types) as T
    },
    serialize(deserialized, helpers) {
      return R.mapObjIndexed((type, key) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return type.serialize(deserialized[key], helpers)
      }, types) as S
    },
    getFocusableChildren(state) {
      const children = R.mapObjIndexed((type, key) => {
        return type.getFocusableChildren(state[key])
      }, types) as { [K in keyof Ds]: { id: string }[] }
      return getFocusableChildren(children)
    },
  }
}

/** @public */
export type ObjectStateType<Ds extends Record<string, StateType>> = StateType<
  StateTypesSerializedType<Ds>,
  StateTypesValueType<Ds>,
  StateTypesReturnType<Ds>
>
