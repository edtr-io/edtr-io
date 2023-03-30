/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Provides utils for the User Interface
 *
 * @packageDocumentation
 */
import _styled, { StyledInterface } from 'styled-components'

/**
 * Re-export of {@link https://styled-components.com/docs/api#primary | `styled` in `styled-components` }
 *
 * @public
 */

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const __styled = _styled as any

export const styled =
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  (__styled.default?.svg ? __styled.default : _styled) as StyledInterface

export * from './deep-partial'
export * from './editor-theme'
export * from './icon'
export * from './renderer-theme'
export * from './theme'
