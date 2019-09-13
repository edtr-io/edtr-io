export interface StoreDeserializeHelpers<
  K extends string = string,
  S = unknown
> {
  createDocument(document: { id: string; plugin?: K; state?: S }): void
}

export interface StoreSerializeHelpers<K extends string = string, S = unknown> {
  getDocument(id: string): { plugin: K; state?: S } | null
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface StateDescriptor<S = any, T = S, R = unknown> {
  (
    value: T,
    onChange: (
      updater: (oldValue: T, helpers: StoreDeserializeHelpers) => T
    ) => void,
    pluginProps?: unknown
  ): R
  createInitialState(helpers: StoreDeserializeHelpers): T
  deserialize(serialized: S, helpers: StoreDeserializeHelpers): T
  serialize(deserialized: T, helpers: StoreSerializeHelpers): S
}

export type StateDescriptorSerializedType<
  D extends StateDescriptor<any>
> = D extends StateDescriptor<infer S, any, any> ? S : never

export type StateDescriptorsSerializedType<
  Ds extends Record<string, StateDescriptor<any>>
> = { [K in keyof Ds]: StateDescriptorSerializedType<Ds[K]> }

export type StateDescriptorValueType<
  D extends StateDescriptor<any>
> = D extends StateDescriptor<any, infer T, any> ? T : never

export type StateDescriptorsValueType<
  Ds extends Record<string, StateDescriptor<any>>
> = { [K in keyof Ds]: StateDescriptorValueType<Ds[K]> }

export type StateDescriptorReturnType<
  D extends StateDescriptor<any>
> = D extends StateDescriptor<any, any, infer R> ? R : never

export type StateDescriptorsReturnType<
  Ds extends Record<string, StateDescriptor<any>>
> = { [K in keyof Ds]: StateDescriptorReturnType<Ds[K]> }

export interface StateType<S = any, T = S, R = unknown> {
  new (
    value: T,
    onChange: (
      updater: (oldValue: T, helpers: StoreDeserializeHelpers) => T
    ) => void,
    pluginProps?: unknown
  ): R
  createInitialState(helpers: StoreDeserializeHelpers): T
  deserialize(serialized: S, helpers: StoreDeserializeHelpers): T
  serialize(deserialized: T, helpers: StoreSerializeHelpers): S
}

export type StateTypeSerializedType<
  D extends StateType<any>
> = D extends StateType<infer S, any, any> ? S : never

export type StateTypesSerializedType<
  Ds extends Record<string, StateType<any>>
> = { [K in keyof Ds]: StateTypeSerializedType<Ds[K]> }

export type StateTypeValueType<D extends StateType<any>> = D extends StateType<
  any,
  infer T,
  any
>
  ? T
  : never

export type StateTypesValueType<Ds extends Record<string, StateType<any>>> = {
  [K in keyof Ds]: StateTypeValueType<Ds[K]>
}

export type StateTypeReturnType<D extends StateType<any>> = D extends StateType<
  any,
  any,
  infer R
>
  ? R
  : never

export type StateTypesReturnType<Ds extends Record<string, StateType<any>>> = {
  [K in keyof Ds]: StateTypeReturnType<Ds[K]>
}
/* eslint-enable @typescript-eslint/no-explicit-any */
