import * as InternalDocumentEditor from '@edtr-io/internal__document-editor/beta'

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Describes the states of a [[Plugin]]. Please note that a state type will be recreated in every render.
 *
 * @example the built-in [[boolean]], [[number]], [[string]], [[scalar]] and [[serializedScalar]], [[list]], [[object]], and [[child]] state types
 * @public
 */
export interface StateType<S = any, T = any, R = any> {
  /**
   * Initializes the public API for usage in plugin components
   *
   * @param state - current state
   * @param onChange - callback to set the state, accepts a [[StateUpdater]] and an optional [[StateExecutor]]
   */
  init(
    state: T,
    onChange: (
      initial: StateUpdater<T>,
      executor?: StateExecutor<StateUpdater<T>>
    ) => void
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
 * An updater will get called with the current state and helpers and should return the new state
 *
 * @param previousState - current state at the time the change is applied
 * @param helpers - helpers (e.g. to insert an document in the store)
 * @returns new state
 *
 * @public
 */
export type StateUpdater<T> = (
  previousState: T,
  helpers: StoreDeserializeHelpers
) => T

/**
 * Describes an asynchronous state update
 *
 * @param resolve - Callback to set the state after the asynchronous process has been completed successfully. Should only be called at most once.
 * @param reject - Callback to set the state after the asynchronous process has been completed unsuccessfully. Should only be called at most once.
 * @param next - Callback to update the state while it is still pending
 * @public
 */
export type StateExecutor<T> = (
  resolve: (value: T) => void,
  reject: (value: T) => void,
  next: (value: T) => void
) => void

/**
 * Describes a child document
 *
 * @public
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
 * @public
 */
export type StateTypeSerializedType<D extends StateType> = D extends StateType<
  infer S
>
  ? S
  : never

/** @public */
export type StateTypesSerializedType<Ds extends Record<string, StateType>> = {
  [K in keyof Ds]: StateTypeSerializedType<Ds[K]>
}

/**
 * Maps a [[StateType]] to the type of its deserialized state
 *
 * @public
 */
export type StateTypeValueType<D extends StateType> = D extends StateType<
  any,
  infer T
>
  ? T
  : never

/** @public */
export type StateTypesValueType<Ds extends Record<string, StateType>> = {
  [K in keyof Ds]: StateTypeValueType<Ds[K]>
}

/**
 * Maps a [[StateType]] to the type of its public API for usage in plugin components
 *
 * @public
 */
export type StateTypeReturnType<D extends StateType> = D extends StateType<
  any,
  any,
  infer R
>
  ? R
  : never

/** @public */
export type StateTypesReturnType<Ds extends Record<string, StateType>> = {
  [K in keyof Ds]: StateTypeReturnType<Ds[K]>
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Helpers to be used by a [[StateType]] when working with a serialized state
 *
 * @public
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
  createDocument(document: { id: string; plugin: K; state?: S }): void
}

/**
 * Helpers to be used by a [[StateType]] when working with a deserialized state
 *
 * @public
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

/** @public */
export interface PluginProps {
  config?: {}
  renderSettings?: InternalDocumentEditor.DocumentEditorProps['renderSettings']
  renderToolbar?: InternalDocumentEditor.DocumentEditorProps['renderToolbar']
}
