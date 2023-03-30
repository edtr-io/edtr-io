/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/**
 * Provides utils for the User Interface
 *
 * @packageDocumentation
 */
import _styled from 'styled-components'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultImport = (mod: any) => {
  if (typeof mod !== 'object' || mod === null) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return mod
  }
  // Webpack provides a Module tag to match NodeJS' Module module
  const defaultVal =
    Symbol.toStringTag in mod && mod[Symbol.toStringTag] === 'Module'
      ? mod.default ?? mod
      : mod
  if (
    '__esModule' in defaultVal &&
    // eslint-disable-next-line @typescript-eslint/naming-convention
    defaultVal.__esModule &&
    defaultVal.default !== undefined
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return defaultVal.default
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return defaultVal
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
