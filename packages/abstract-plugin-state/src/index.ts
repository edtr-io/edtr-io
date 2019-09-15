/**
 * @module @edtr-io/plugin
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Describes the states of a [[Plugin]]. Please note that a state type will be recreated in every render.
 *
 * @typeparam S - serialized state of the plugin (i.e. this type will be used in [[serializeDocument]](
 * @typeparam T - state of the plugin (equals `S` by default)
 * @typeparam R - public API for usage in plugin components
 * @example the built-in [[boolean]], [[number]], [[string]], [[scalar]] and [[serializedScalar]], [[list]], [[object]], and [[child]] state types
 */
export interface StateType<S = any, T = S, R = unknown> {
  /**
   * Initializes the public API for usage in plugin components
   *
   * @param state - current state
   * @param onChange - callback to set the state, accepts a [[StateUpdater]]
   * @param pluginProps - additional props that should be passed down to the component. Only used by [[child]]
   */
  init(
    state: T,
    onChange: (change: StateUpdater<T>) => void,
    pluginProps?: unknown
  ): R

  /**
   * Creates the initial state
   *
   * @param helpers - helpers (e.g. to insert an document in the store)
   * @returns initial state
   */
  createInitialState(helpers: StoreDeserializeHelpers): T

  /**
   * Deserializes a serialized state
   *
   * @param serialized - serialized state to deserialize
   * @param helpers - helpers (e.g. to insert an document in the store)
   * @returns deserialized state
   */
  deserialize(serialized: S, helpers: StoreDeserializeHelpers): T

  /**
   * Serializes a state
   *
   * @param deserialized - state to serialize
   * @param helpers - helpers (e.g. to serialize an document)
   * @returns serialized state
   */
  serialize(deserialized: T, helpers: StoreSerializeHelpers): S

  /**
   * Gives the editor information about the children of the plugin (e.g. to build the document tree)
   *
   * @param state - current state
   * @returns an array of children, each described by an object with an `id`
   */
  getFocusableChildren(state: T): FocusableChild[]
}

/**
 * A state updater will get called with the current state and helpers and should return the new state
 *
 * @param previousState - current state at the time the change is applied
 * @param helpers - helpers (e.g. to insert an document in the store)
 * @returns new state
 */
export type StateUpdater<T> = (
  previousState: T,
  helpers: StoreDeserializeHelpers
) => T

/**
 * Describes a child document
 */
export interface FocusableChild {
  /**
   * Id of the document
   */
  id: string
}

/**
 * Maps a [[StateType]] to the type of its serialized state
 *
 * @typeparam D - state type
 */
export type StateTypeSerializedType<
  D extends StateType<any>
> = D extends StateType<infer S, any, any> ? S : never

/**
 * @ignore
 */
export type StateTypesSerializedType<
  Ds extends Record<string, StateType<any>>
> = { [K in keyof Ds]: StateTypeSerializedType<Ds[K]> }

/**
 * Maps a [[StateType]] to the type of its deserialized state
 *
 * @typeparam D - state type
 */
export type StateTypeValueType<D extends StateType<any>> = D extends StateType<
  any,
  infer T,
  any
>
  ? T
  : never

/**
 * @ignore
 */
export type StateTypesValueType<Ds extends Record<string, StateType<any>>> = {
  [K in keyof Ds]: StateTypeValueType<Ds[K]>
}

/**
 * Maps a [[StateType]] to the type of its public API for usage in plugin components
 *
 * @typeparam D - state type
 */
export type StateTypeReturnType<D extends StateType<any>> = D extends StateType<
  any,
  any,
  infer R
>
  ? R
  : never

/**
 * @ignore
 */
export type StateTypesReturnType<Ds extends Record<string, StateType<any>>> = {
  [K in keyof Ds]: StateTypeReturnType<Ds[K]>
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Helpers to be used by a [[StateType]] when working with a serialized state
 *
 * @typeparam K - name of the plugin for `createDocument`
 * @typeparam S - state of the plugin for `createDocument`
 */
export interface StoreDeserializeHelpers<
  K extends string = string,
  S = unknown
> {
  /**
   * Inserts a document into the store
   *
   * @param document - document to insert
   */
  createDocument(document: { id: string; plugin?: K; state?: S }): void
}

/**
 * Helpers to be used by a [[StateType]] when working with a deserialized state
 *
 * @typeparam K - name of the plugin for `getDocument`
 * @typeparam S - state of the plugin for `getDocument`
 */
export interface StoreSerializeHelpers<K extends string = string, S = unknown> {
  /**
   * Retrieves a document from the store
   *
   * @param id - id of the document
   * @returns the document if it exists, `null` otherwise
   */
  getDocument(id: string): { plugin: K; state?: S } | null
}
