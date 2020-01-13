/**
 * @module @edtr-io/plugin
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import {
  StateType,
  StateTypesSerializedType,
  StateTypesValueType,
  StateTypesReturnType,
  StateTypeReturnType,
  FocusableChild,
  StateUpdater,
  StateExecutor
} from '@edtr-io/internal__plugin-state'
import * as R from 'ramda'

/** @public */
export function object<Ds extends Record<string, StateType>>(
  types: Ds,
  getFocusableChildren: (
    children: { [K in keyof Ds]: { id: string }[] }
  ) => { id: string }[] = children => {
    return R.flatten<readonly FocusableChild[][]>(R.values(children))
  }
): StateType<
  StateTypesSerializedType<Ds>,
  StateTypesValueType<Ds>,
  StateTypesReturnType<Ds>
> {
  type S = StateTypesSerializedType<Ds>
  type T = StateTypesValueType<Ds>
  type U = StateTypesReturnType<Ds>

  return {
    init(state, onChange, pluginProps) {
      return R.mapObjIndexed((type, key) => {
        return type.init(state[key], innerOnChange, pluginProps)

        function innerOnChange(
          initial: StateUpdater<StateTypeReturnType<typeof type>>,
          executor?: StateExecutor<
            StateUpdater<StateTypeReturnType<typeof type>>
          >
        ): void {
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
          onChange(
            wrapUpdater(initial),
            executor
              ? (resolve, reject, next) => {
                  executor(
                    innerUpdater => resolve(wrapUpdater(innerUpdater)),
                    innerUpdater => reject(wrapUpdater(innerUpdater)),
                    innerUpdater => next(wrapUpdater(innerUpdater))
                  )
                }
              : undefined
          )
        }
      }, types) as U
    },
    createInitialState(helpers) {
      return R.map(type => {
        return type.createInitialState(helpers)
      }, types) as T
    },
    deserialize(serialized, helpers) {
      return R.mapObjIndexed((type, key) => {
        return type.deserialize(serialized[key], helpers)
      }, types) as T
    },
    serialize(deserialized, helpers) {
      return R.mapObjIndexed((type, key) => {
        return type.serialize(deserialized[key], helpers)
      }, types) as S
    },
    getFocusableChildren(state) {
      const children = R.mapObjIndexed((type, key) => {
        return type.getFocusableChildren(state[key])
      }, types) as { [K in keyof Ds]: { id: string }[] }
      return getFocusableChildren(children)
    }
  }
}
