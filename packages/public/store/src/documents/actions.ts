import { StateExecutor, StateUpdater } from '@edtr-io/internal__plugin-state'

import { createActionCreator } from '../helpers'
import {
  ActionCreatorAction,
  ActionCreatorWithPayload,
  DocumentState,
} from '../types'

/** @public */
export const insert = createActionCreator<
  'Insert',
  {
    id: string
    plugin: string
    state?: unknown
  }
>('Insert')
/** @public */
export type InsertAction = ActionCreatorAction<typeof insert>
/** @internal */
export const pureInsert = createActionCreator<
  'PureInsert',
  {
    id: string
  } & DocumentState
>('PureInsert')
/** @internal */
export type PureInsertAction = ActionCreatorAction<typeof pureInsert>

/** @public */
export const remove = createActionCreator<'Remove', string>('Remove')
/** @public */
export type RemoveAction = ActionCreatorAction<typeof remove>
/** @internal */
export const pureRemove = createActionCreator<'PureRemove', string>(
  'PureRemove'
)
/** @internal */
export type PureRemoveAction = ActionCreatorAction<typeof pureRemove>

/** @public */
export const change: ActionCreatorWithPayload<
  'Change',
  {
    id: string
    state: {
      initial: StateUpdater<unknown>
      executor?: StateExecutor<StateUpdater<unknown>>
    }
    reverse?: (previousState: unknown) => unknown
  }
> = createActionCreator('Change')
/** @public */
export type ChangeAction = ActionCreatorAction<typeof change>
/** @internal */
export const pureChange: ActionCreatorWithPayload<
  'PureChange',
  { id: string; state: unknown }
> = createActionCreator('PureChange')
/** @internal */
export type PureChangeAction = ActionCreatorAction<typeof pureChange>

/** @public */
export const wrap: ActionCreatorWithPayload<
  'Wrap',
  {
    id: string
    document: (id: string) => DocumentState
  }
> = createActionCreator('Wrap')
/** @public */
export type WrapAction = ActionCreatorAction<typeof wrap>
/** @internal */
export const pureWrap: ActionCreatorWithPayload<
  'PureWrap',
  {
    id: string
    newId: string
    document: DocumentState
  }
> = createActionCreator('PureWrap')
/** @internal */
export type PureWrapAction = ActionCreatorAction<typeof pureWrap>

/** @public */
export const unwrap: ActionCreatorWithPayload<
  'Unwrap',
  {
    id: string
    oldId: string
  }
> = createActionCreator('Unwrap')
/** @public */
export type UnwrapAction = ActionCreatorAction<typeof unwrap>
/** @internal */
export const pureUnwrap: ActionCreatorWithPayload<
  'PureUnwrap',
  {
    id: string
    oldId: string
  }
> = createActionCreator('PureUnwrap')
/** @internal */
export type PureUnwrapAction = ActionCreatorAction<typeof pureUnwrap>

/** @public */
export const replace: ActionCreatorWithPayload<
  'Replace',
  {
    id: string
    plugin: string
    state?: unknown
  }
> = createActionCreator('Replace')
/** @public */
export type ReplaceAction = ActionCreatorAction<typeof replace>
/** @internal */
export const pureReplace: ActionCreatorWithPayload<
  'PureReplace',
  {
    id: string
    plugin: string
    state?: unknown
  }
> = createActionCreator('PureReplace')
/** @internal */
export type PureReplaceAction = ActionCreatorAction<typeof pureReplace>

/** @public */
export const replaceText: ActionCreatorWithPayload<
  'ReplaceText',
  {
    id: string
    document: (id: string) => DocumentState
  }
> = createActionCreator('ReplaceText')
/** @public */
export type ReplaceTextAction = ActionCreatorAction<typeof replaceText>
/** @internal */
export const pureReplaceText: ActionCreatorWithPayload<
  'PureReplaceText',
  {
    id: string
    newId: string
    document: DocumentState
  }
> = createActionCreator('PureReplaceText')
/** @internal */
export type PureReplaceTextAction = ActionCreatorAction<typeof pureReplaceText>

/** @public */
export type DocumentsAction =
  | InsertAction
  | RemoveAction
  | ChangeAction
  | WrapAction
  | UnwrapAction
  | ReplaceAction
  | ReplaceTextAction
/** @internal */
export type InternalDocumentsAction =
  | PureInsertAction
  | PureRemoveAction
  | PureChangeAction
  | PureWrapAction
  | PureUnwrapAction
  | PureReplaceAction
  | PureReplaceTextAction
