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

function PluginPropsDocument({
  id,
  props,
  parentProps
}: {
  id: string
  props?: PluginProps
  parentProps: PluginProps
}) {
  const pluginProps = React.useMemo((): PluginProps => {
    return { ...props, parent: parentProps }
  }, [props, parentProps])
  return <SubDocument pluginProps={pluginProps} id={id} />
}

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
          return (
            <PluginPropsDocument
              key={id}
              id={id}
              props={{
                ...props,
                config: R.mergeDeepRight(config || {}, props.config || {})
              }}
              parentProps={pluginProps || {}}
            />
          )
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
