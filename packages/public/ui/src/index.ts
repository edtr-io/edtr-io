/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Provides utils for the User Interface
 *
 * @packageDocumentation
 */
import _styled from 'styled-components'

type ExtractDefault<T> = T extends {
  __esModule?: boolean
  default: infer U
}
  ? U extends {
      __esModule?: boolean
      default: infer V
    }
    ? V
    : U
  : T

function defaultImport<T>(mod_: T): ExtractDefault<T> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const mod = mod_ as any
  if (typeof mod !== 'object' || mod === null) {
    return mod as ExtractDefault<T>
  }
  // Webpack provides a Module tag to match NodeJS' Module module
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const defaultVal =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    Symbol.toStringTag in mod && mod[Symbol.toStringTag] === 'Module'
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        mod.default ?? mod
      : mod
  if (
    '__esModule' in defaultVal &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    defaultVal.__esModule &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    defaultVal.default !== undefined
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return defaultVal.default as ExtractDefault<T>
  }
  return defaultVal as ExtractDefault<T>
}

/**
 * Re-export of {@link https://styled-components.com/docs/api#primary | `styled` in `styled-components` }
 *
 * @public
 */
export const styled = defaultImport(_styled)

export * from './deep-partial'
export * from './editor-theme'
export * from './icon'
export * from './renderer-theme'
export * from './theme'
