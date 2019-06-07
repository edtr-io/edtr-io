import * as React from 'react'
import { v4 } from 'uuid'

import {
  StateDescriptor,
  StoreDeserializeHelpers,
  StoreSerializeHelpers
} from './types'

const memoizedRender = <Props extends Record<string, unknown>>(
  parentProps: unknown,
  id: string
) =>
  function Child(props?: Props) {
    return (
      <Document
        pluginProps={{ ...props, parent: parentProps }}
        key={id}
        id={id}
      />
    )
  }

import { Document } from '..'

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
        render: memoizedRender(parentProps, id)
      })
    },
    {
      createInitialState({ createDocument }: StoreDeserializeHelpers<K, S>) {
        const id = v4()
        createDocument({ id, plugin, state })
        return id
      },
      deserialize(
        serialized: { plugin: K; state?: S },
        { createDocument }: StoreDeserializeHelpers<K, S>
      ): string {
        const id = v4()
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
