export interface StoreDeserializeHelpers<
  K extends string = string,
  S = unknown
> {
  createDocument(document: { id: string; plugin?: K; state?: S }): void
}

export interface StoreSerializeHelpers<K extends string = string, S = unknown> {
  getDocument(id: string): { plugin: K; state?: S } | null
}

export interface StateDescriptor<S, T = S, R = unknown> {
  (
    value: T,
    onChange: (
      updater: (oldValue: T, helpers: StoreDeserializeHelpers) => T
    ) => void
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = D extends StateDescriptor<any, infer T, any> ? T : never

export type StateDescriptorsValueType<
  Ds extends Record<string, StateDescriptor<any>>
> = { [K in keyof Ds]: StateDescriptorValueType<Ds[K]> }

export type StateDescriptorReturnType<
  D extends StateDescriptor<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = D extends StateDescriptor<any, any, infer R> ? R : never

export type StateDescriptorsReturnType<
  Ds extends Record<string, StateDescriptor<any>>
> = { [K in keyof Ds]: StateDescriptorReturnType<Ds[K]> }
