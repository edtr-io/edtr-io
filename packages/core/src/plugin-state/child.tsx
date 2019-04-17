import * as React from 'react'
import { v4 } from 'uuid'

import {
  StateDescriptor,
  StoreDeserializeHelpers,
  StoreSerializeHelpers
} from './types'
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
    (id: string) => {
      return Object.assign(() => id, {
        id,
        //eslint-disable-next-line react/display-name
        render: (props?: Props) => {
          return <Document pluginProps={props} key={id} id={id} />
        }
      })
    },
    {
      createInitialState({ createDocument }: StoreDeserializeHelpers<K, S>) {
        const id = v4()
        createDocument({ id, plugin, state })
        return { immediateState: id }
      },
      deserialize(
        serialized: { plugin: K; state?: S },
        { createDocument }: StoreDeserializeHelpers<K, S>
      ) {
        const id = v4()
        createDocument({ id, ...serialized })
        return { immediateState: id }
      },
      serialize(
        id: string,
        { getDocument }: StoreSerializeHelpers<K, S>
      ): { plugin: K; state?: S } {
        const document = getDocument(id)
        if (document === null) {
          throw new Error('There exists no document with the given id: ' + id)
        }
        return document
      }
    }
  )
}
