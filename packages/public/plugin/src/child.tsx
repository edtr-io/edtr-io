import { SubDocument } from '@edtr-io/core'
import * as R from 'ramda'
import * as React from 'react'
import { generate } from 'shortid'

import {
  StoreSerializeHelpers,
  StateType,
  PluginProps,
} from './internal-plugin-state'

/**
 * @param params - The params
 * @public
 */
export function child<K extends string, S = unknown>(
  params: ChildStateTypeConfig
): ChildStateType<K, S> {
  const { plugin, initialState, config } = params
  return {
    init(id, onChange) {
      return {
        get() {
          return id
        },
        id,
        render: function Child(props: PluginProps = {}) {
          const pluginProps = {
            ...props,
            config: R.mergeDeepRight(config || {}, props.config || {}),
          }
          return <SubDocument key={id} pluginProps={pluginProps} id={id} />
        },
        replace: (plugin, state) => {
          onChange((_id, helpers) => {
            helpers.createDocument({ id, plugin, state })
            return id
          })
        },
      }
    },
    createInitialState({ createDocument }) {
      const id = generate()
      createDocument({ id, plugin, state: initialState })
      return id
    },
    deserialize(serialized, { createDocument }) {
      const id = generate()
      createDocument({ id, ...serialized })
      return id
    },
    serialize(id, { getDocument }: StoreSerializeHelpers<K, S>) {
      const document = getDocument(id)
      if (document === null) {
        throw new Error('There exists no document with the given id')
      }
      return document
    },
    getFocusableChildren(id) {
      return [{ id }]
    },
  }
}

/** @public */
export type ChildStateType<K extends string = string, S = unknown> = StateType<
  { plugin: K; state?: S },
  string,
  {
    get(): string
    id: string
    render: (props?: PluginProps) => React.ReactElement
    replace: (plugin: K, state?: S) => void
  }
>

/** @public */
export interface ChildStateTypeConfig<K extends string = string, S = unknown> {
  plugin: K
  initialState?: S
  // eslint-disable-next-line @typescript-eslint/ban-types
  config?: {}
}
