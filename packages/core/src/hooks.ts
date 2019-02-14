export function createChild(plugin?: string) {
  return (blackbox: Blackbox<T>) => {
    const [ render, remove ] = useChild(blackbox, plugin)

    return {
      render,
      remove
    }
  }
}

export function useChild(
  blackbox: Blackbox<unknown>,
  plugin?: string
): [() => React.ReactNode, () => void] {
  return [
    () => {
      return null
    },
    () => {}
  ]
}

export function createLeaf<T>(initialValue?: T) {
  return (blackbox: Blackbox<T>) => {
    const [value, setValue] = useLeaf(blackbox, initialValue)

    return {
      value,
      setValue
    }
  }
}

export function useLeaf<T>(
  blackbox: Blackbox<T>,
  initialValue?: T
): [T, (value: T) => void] {
  // @ts-ignore
  return [null, () => {}]
}

export type HookReturnType<
  T extends {
    key: string
    hook: Hook<any>
  }
  > = T['hook'] extends Hook<any, infer R> ? R : never

export function createObject(
  hooks: Array<{
    key: string
    hook: Hook<any>
  }>
) {
  return (blackbox: Blackbox<unknown>): unknown => {
    return null
  }
}

export function createList(
  hooks: Hook<any>
)
{
  return (blackbox: Blackbox<unknown>): [
    unknown[],
    (atIndex?: number) => {},
    (removeIndex: number) => {}
    ] => {
    // @ts-ignore
    return null
  }
}

export interface Blackbox<T = unknown> {
  children: unknown[]
  value?: T
}

export type Hook<T, R = unknown> = (blackbox: Blackbox<T>) => R
