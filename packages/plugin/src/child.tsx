import {
  StoreSerializeHelpers,
  StateType
} from '@edtr-io/abstract-plugin-state'
import { SubDocument } from '@edtr-io/core'
import * as React from 'react'
import { generate } from 'shortid'

function PluginPropsDocument<Props extends Record<string, unknown>>({
  id,
  props,
  parentProps
}: {
  id: string
  props?: Props
  parentProps: unknown
}) {
  const pluginProps = React.useMemo(() => {
    return { ...props, parent: parentProps }
  }, [props, parentProps])
  return <SubDocument pluginProps={pluginProps} id={id} />
}

const memoizedRender = <Props extends Record<string, unknown>>(
  parentProps: unknown,
  id: string
) => {
  return function Child(props?: Props) {
    return (
      <PluginPropsDocument
        key={id}
        id={id}
        props={props}
        parentProps={parentProps}
      />
    )
  }
}

export function child<
  K extends string,
  S = unknown,
  Props extends Record<string, unknown> = {}
>(
  plugin?: K,
  state?: S
): StateType<
  { plugin: K; state?: S },
  string,
  {
    get(): string
    id: string
    render: (props?: Props) => React.ReactNode
  }
> {
  return {
    init(id, onChange, pluginProps) {
      return {
        get() {
          return id
        },
        id,
        render: memoizedRender(pluginProps, id)
      }
    },
    createInitialState({ createDocument }) {
      const id = generate()
      createDocument({ id, plugin, state })
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
