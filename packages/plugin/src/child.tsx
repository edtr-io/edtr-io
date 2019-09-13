import {
  StoreDeserializeHelpers,
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
  return class ChildStateType {
    public render: (props?: Props) => React.ReactNode

    constructor(
      public id: string,
      protected onChange: (
        updater: (oldValue: string, helpers: StoreDeserializeHelpers) => string
      ) => void,
      protected pluginProps?: unknown
    ) {
      this.render = memoizedRender(this.pluginProps, this.id)
    }

    static createInitialState({
      createDocument
    }: StoreDeserializeHelpers<K, S>) {
      const id = generate()
      createDocument({ id, plugin, state })
      return id
    }

    static deserialize(
      serialized: { plugin: K; state?: S },
      { createDocument }: StoreDeserializeHelpers<K, S>
    ): string {
      const id = generate()
      createDocument({ id, ...serialized })
      return id
    }

    static serialize(
      id: string,
      { getDocument }: StoreSerializeHelpers<K, S>
    ): { plugin: K; state?: S } {
      const document = getDocument(id)
      if (document === null) {
        throw new Error('There exists no document with the given id')
      }
      return document
    }

    public get = () => {
      return this.id
    }
  }
}
