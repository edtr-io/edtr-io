import * as R from 'ramda'

/**
 * Transforms a type by making all its properties optional, recursively.
 *
 * @public
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends readonly (infer U)[]
    ? readonly DeepPartial<U>[]
    : // eslint-disable-next-line @typescript-eslint/ban-types
    T[P] extends Function
    ? T[P]
    : DeepPartial<T[P]>
}

/**
 * Creates a new object with the own properties of `values` merged with the own properties of `fallback`.
 * If a key exists in both objects:
 * and both values are objects, the two values will be recursively merged
 * otherwise the value from the `values` object will be used.
 *
 * @param payload - An object containing `fallback` and `values`
 * @returns The merged object
 * @public
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function merge<T extends {}>(payload: MergePayload<T>) {
  return R.mergeDeepRight(payload.fallback, payload.values) as T
}
/** @public */
export interface MergePayload<T> {
  fallback: T
  values: DeepPartial<T>
}
