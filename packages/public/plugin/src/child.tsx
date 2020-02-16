import { SubDocument } from '@edtr-io/core'
import * as R from 'ramda'
import * as React from 'react'
import { generate } from 'shortid'

import {
  StoreSerializeHelpers,
  StateType,
  PluginProps
} from './internal-plugin-state'

/** @public */
export function child<K extends string, S = unknown>({
  plugin,
  initialState,
  config
}: {
  plugin?: K
  initialState?: S
  config?: {}
} = {}): ChildStateType<K, S> {
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
            config: R.mergeDeepRight(config || {}, props.config || {})
          }
          return <SubDocument key={id} pluginProps={pluginProps} id={id} />
        },
        replace: (plugin, state) => {
          onChange((_id, helpers) => {
            helpers.createDocument({ id, plugin, state })
            return id
          })
        }
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
    }
  }
}

/** @public */
export type ChildStateType<K extends string = string, S = unknown> = StateType<
  { plugin: K; state?: S },
  string,
  {
    get(): string
    id: string
    render: (props?: PluginProps) => React.ReactNode
    replace: (plugin?: K, state?: S) => void
  }
>
