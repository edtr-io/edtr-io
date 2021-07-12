import * as InternalPluginState from '@edtr-io/internal__plugin-state'

/* eslint-disable @typescript-eslint/no-explicit-any */
/** @public */
export type FocusableChild = InternalPluginState.FocusableChild
/** @public */
export type PluginProps = InternalPluginState.PluginProps
/** @public */
export type StateExecutor<T> = InternalPluginState.StateExecutor<T>
/** @public */
export type StateType<
  S = any,
  T = any,
  R = any
> = InternalPluginState.StateType<S, T, R>
/** @public */
export type StateTypeReturnType<D extends StateType> =
  InternalPluginState.StateTypeReturnType<D>
/** @public */
export type StateTypesReturnType<Ds extends Record<string, StateType>> =
  InternalPluginState.StateTypesReturnType<Ds>
/** @public */
export type StateTypeSerializedType<D extends StateType> =
  InternalPluginState.StateTypeSerializedType<D>
/** @public */
export type StateTypesSerializedType<Ds extends Record<string, StateType>> =
  InternalPluginState.StateTypesSerializedType<Ds>
/** @public */
export type StateTypeValueType<D extends StateType> =
  InternalPluginState.StateTypeValueType<D>
/** @public */
export type StateTypesValueType<Ds extends Record<string, StateType>> =
  InternalPluginState.StateTypesValueType<Ds>
/** @public */
export type StateUpdater<T> = InternalPluginState.StateUpdater<T>
/** @public */
export type StoreDeserializeHelpers<
  K extends string = string,
  S = unknown
> = InternalPluginState.StoreDeserializeHelpers<K, S>
/** @public */
export type StoreSerializeHelpers<
  K extends string = string,
  S = unknown
> = InternalPluginState.StoreSerializeHelpers<K, S>
/* eslint-enable @typescript-eslint/no-explicit-any */
