import { StateExecutor, StateUpdater } from '@edtr-io/internal__plugin-state'

import { createAction } from '../helpers'
import { ActionFromActionCreator, DocumentState } from '../types'

/** @public */
export const insert = createAction<
  'Insert',
  {
    id: string
    plugin?: string
    state?: unknown
  }
>('Insert')
/** @public */
export type InsertAction = ActionFromActionCreator<typeof insert>
/** @public */
export const pureInsert = createAction<
  'PureInsert',
  {
    id: string
  } & DocumentState
>('PureInsert')
/** @public */
export type PureInsertAction = ActionFromActionCreator<typeof pureInsert>

/** @public */
export const remove = createAction<'Remove', string>('Remove')
/** @public */
export type RemoveAction = ActionFromActionCreator<typeof remove>

/** @public */
export const pureRemove = createAction<'PureRemove', string>('PureRemove')
/** @public */
export type PureRemoveAction = ActionFromActionCreator<typeof pureRemove>

/** @public */
export const change = createAction<
  'Change',
  {
    id: string
    state: {
      initial: StateUpdater<unknown>
      executor?: StateExecutor<StateUpdater<unknown>>
    }
  }
>('Change')
/** @public */
export type ChangeAction = ActionFromActionCreator<typeof change>
/** @public */
export const pureChange = createAction<
  'PureChange',
  { id: string; state: unknown }
>('PureChange')
/** @public */
export type PureChangeAction = ActionFromActionCreator<typeof pureChange>

/** @public */
export const wrap = createAction<
  'Wrap',
  {
    id: string
    document: (id: string) => DocumentState
  }
>('Wrap')
/** @public */
export type WrapAction = ActionFromActionCreator<typeof wrap>
/** @public */
export const pureWrap = createAction<
  'PureWrap',
  {
    id: string
    newId: string
    document: DocumentState
  }
>('PureWrap')
/** @public */
export type PureWrapAction = ActionFromActionCreator<typeof pureWrap>

/** @public */
export const unwrap = createAction<
  'Unwrap',
  {
    id: string
    oldId: string
  }
>('Unwrap')
/** @public */
export type UnwrapAction = ActionFromActionCreator<typeof unwrap>
/** @public */
export const pureUnwrap = createAction<
  'PureUnwrap',
  {
    id: string
    oldId: string
  }
>('PureUnwrap')
/** @public */
export type PureUnwrapAction = ActionFromActionCreator<typeof pureUnwrap>

/** @public */
export const replace = createAction<
  'Replace',
  {
    id: string
    plugin: string
    state?: unknown
  }
>('Replace')
/** @public */
export type ReplaceAction = ActionFromActionCreator<typeof replace>
/** @public */
export const pureReplace = createAction<
  'PureReplace',
  {
    id: string
    plugin: string
    state?: unknown
  }
>('PureReplace')
/** @public */
export type PureReplaceAction = ActionFromActionCreator<typeof pureReplace>

/** @public */
export type DocumentsAction =
  | InsertAction
  | PureInsertAction
  | RemoveAction
  | PureRemoveAction
  | ChangeAction
  | PureChangeAction
  | WrapAction
  | PureWrapAction
  | UnwrapAction
  | PureUnwrapAction
  | ReplaceAction
  | PureReplaceAction
