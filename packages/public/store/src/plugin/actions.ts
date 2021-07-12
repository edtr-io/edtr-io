import { createActionCreator } from '../helpers'
import { ActionCreatorAction, ActionCreatorWithPayload } from '../types'

/** @public */
export const insertChildBefore = createActionCreator<
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
export type InsertChildBeforeAction = ActionCreatorAction<
  typeof insertChildBefore
>
/** @public */
export const insertChildAfter: ActionCreatorWithPayload<
  'InsertChildAfter',
  {
    parent: string
    sibling?: string
    document?: {
      plugin: string
      state?: unknown
    }
  }
> = createActionCreator('InsertChildAfter')
/** @public */
export type InsertChildAfterAction = ActionCreatorAction<
  typeof insertChildAfter
>

/** @public */
export const removeChild: ActionCreatorWithPayload<
  'RemoveChild',
  {
    parent: string
    child: string
  }
> = createActionCreator('RemoveChild')
/** @public */
export type RemoveChildAction = ActionCreatorAction<typeof removeChild>

/** @public */
export type PluginAction =
  | InsertChildBeforeAction
  | InsertChildAfterAction
  | RemoveChildAction
