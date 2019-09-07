import {
  StateDescriptor,
  StoreDeserializeHelpers,
  StoreSerializeHelpers
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
) =>
  function Child(props?: Props) {
    return (
      <PluginPropsDocument
        key={id}
        id={id}
        props={props}
        parentProps={parentProps}
      />
    )
  }

export function child<
  K extends string,
  S = unknown,
  Props extends Record<string, unknown> = {}
>(
  plugin?: K,
  state?: S
): StateDescriptor<
  { plugin: K; state?: S },
  string,
  {
    (): string
    id: string
    render: (props?: Props) => React.ReactNode
  }
> {
  return Object.assign(
    (
      id: string,
      _onChange: (
        updater: (oldValue: string, helpers: StoreDeserializeHelpers) => string
      ) => void,
      parentProps?: unknown
    ) => {
      return Object.assign(() => id, {
        id,
        //eslint-disable-next-line react/display-name
        render: memoizedRender(parentProps, id)
      })
    },
    {
      createInitialState({ createDocument }: StoreDeserializeHelpers<K, S>) {
        const id = generate()
        createDocument({ id, plugin, state })
        return id
      },
      deserialize(
        serialized: { plugin: K; state?: S },
        { createDocument }: StoreDeserializeHelpers<K, S>
      ): string {
        const id = generate()
        createDocument({ id, ...serialized })
        return id
      },
      serialize(
        id: string,
        { getDocument }: StoreSerializeHelpers<K, S>
      ): { plugin: K; state?: S } {
        const document = getDocument(id)
        if (document === null) {
          throw new Error('There exists no document with the given id')
        }
        return document
      }
    }
  )
}
