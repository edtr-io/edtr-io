import { defaultImport } from 'default-import'
/**
 * Provides utils for the User Interface
 *
 * @packageDocumentation
 */
import _styled from 'styled-components'

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
