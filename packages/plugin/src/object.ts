/**
 * @module @edtr-io/plugin
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import {
  StoreDeserializeHelpers,
  StateType,
  StateTypesSerializedType,
  StateTypesValueType,
  StateTypesReturnType,
  StateTypeReturnType,
  FocusableChild
} from '@edtr-io/abstract-plugin-state'
import * as R from 'ramda'

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
          updater: (
            oldValue: StateTypeReturnType<typeof type>,
            helpers: StoreDeserializeHelpers
          ) => StateTypeReturnType<typeof type>
        ): void {
          onChange((oldObj, helpers) =>
            R.set(R.lensProp(key), updater(oldObj[key], helpers), oldObj)
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
