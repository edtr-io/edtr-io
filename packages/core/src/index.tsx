import * as React from 'react'

export const foo: string = 'bar'

export function Bar({ name }: BarProps) {
  return <p>Hello {name}</p>
}

export interface BarProps {
  name: string
}
