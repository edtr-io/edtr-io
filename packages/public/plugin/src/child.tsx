/**
 * @module @edtr-io/plugin
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { SubDocument } from '@edtr-io/core'
import {
  StoreSerializeHelpers,
  StateType,
  PluginProps
} from '@edtr-io/internal__plugin-state'
import * as R from 'ramda'
import * as React from 'react'
import { generate } from 'shortid'

export function child<K extends string, S = unknown>({
  plugin,
  initialState,
  config
}: {
  plugin?: K
  initialState?: S
  config?: {}
} = {}): StateType<
  { plugin: K; state?: S },
  string,
  {
    get(): string
    id: string
    render: (props?: PluginProps) => React.ReactNode
    replace: (plugin?: K, state?: S) => void
  }
> {
  return {
    init(id, onChange, pluginProps) {
      return {
        get() {
          return id
        },
        id,
        render: function Child(props: PluginProps = {}) {
          const childPluginProps = React.useMemo((): PluginProps => {
            return {
              ...props,
              config: R.mergeDeepRight(config || {}, props.config || {}),
              parent: pluginProps || {}
            }
          }, [props, pluginProps])
          return <SubDocument pluginProps={childPluginProps} id={id} />
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
