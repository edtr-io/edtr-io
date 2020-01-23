import { createAction } from '../helpers'
import { ActionFromActionCreator } from '../types'

/** @public */
export const insertChildBefore = createAction<
  'InsertChildBefore',
  {
    parent: string
    sibling: string
    document?: {
      plugin: string
      state?: unknown
    }
  }
>('InsertChildBefore')
/** @public */
export type InsertChildBeforeAction = ActionFromActionCreator<
  typeof insertChildBefore
>
/** @public */
export const insertChildAfter = createAction<
  'InsertChildAfter',
  {
    parent: string
    sibling?: string
    document?: {
      plugin: string
      state?: unknown
    }
  }
>('InsertChildAfter')
/** @public */
export type InsertChildAfterAction = ActionFromActionCreator<
  typeof insertChildAfter
>

/** @public */
export const removeChild = createAction<
  'RemoveChild',
  {
    parent: string
    child: string
  }
>('RemoveChild')
/** @public */
export type RemoveChildAction = ActionFromActionCreator<typeof removeChild>

/** @public */
export type PluginAction =
  | InsertChildBeforeAction
  | InsertChildAfterAction
  | RemoveChildAction
