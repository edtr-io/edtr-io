import * as R from 'ramda'
import * as React from 'react'
import {
  Provider as ReduxProvider,
  connect as reduxConnect,
  MapDispatchToPropsParam,
  MapStateToProps,
  MapStateToPropsParam,
  ProviderProps,
  ReactReduxContextValue
} from 'react-redux'
import { Action, EditorState, StoreState } from './store'
import { ActionCreator, createActionWithoutPayload } from './store/helpers'
import { reducer } from './store/reducer'

export const ScopeContext = React.createContext<{
  scope: string
  editable: boolean
}>({ scope: '', editable: true })

export const EditorContext = React.createContext<
  ReactReduxContextValue<StoreState>
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  undefined as any
)

export function Provider(
  props: ProviderProps<Action> & { children: React.ReactNode }
) {
  return <ReduxProvider {...props} context={EditorContext} />
}

type InferStoreDispatchProps<T> = T extends Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ScopedActionCreator<ActionCreator<any, any>>
>
  ? {
      [K in keyof T]: ((
        ...args: Parameters<T[K]>
      ) => (scope: string) => ReturnType<T[K]>) & { type: string }
    }
  : never

export function connect<
  StateProps,
  DispatchProps extends Record<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ScopedActionCreator<ActionCreator<any, any>>
  >,
  OwnProps extends { scope: string }
>(
  mapStateToProps: MapStateToProps<StateProps, OwnProps, EditorState>,
  mapDispatchToProps: InferStoreDispatchProps<DispatchProps>
) {
  return reduxConnect(
    scopedMapStateToProps(mapStateToProps),
    scopedMapDispatchToProps<OwnProps, InferStoreDispatchProps<DispatchProps>>(
      mapDispatchToProps
    ),
    null,
    {
      context: EditorContext
    }
  )
}
export function connectStateOnly<
  StateProps,
  OwnProps extends { scope: string }
>(mapStateToProps: MapStateToProps<StateProps, OwnProps, EditorState>) {
  return reduxConnect(scopedMapStateToProps(mapStateToProps), null, null, {
    context: EditorContext
  })
}

function scopedMapStateToProps<StateProps, OwnProps extends { scope: string }>(
  mapEditorStateToProps: MapStateToProps<StateProps, OwnProps, EditorState>
): MapStateToPropsParam<StateProps, OwnProps, StoreState> {
  return (state, props) => {
    let editorState = state[props.scope]
    if (!editorState) {
      const fakeInitAction = createActionWithoutPayload('InitSubScope')()(
        props.scope
      )
      editorState = reducer(state, (fakeInitAction as unknown) as Action)[
        props.scope
      ]
    }
    return mapEditorStateToProps(editorState, props)
  }
}

export type ScopedActionCreator<T> = T extends (
  ...args: infer P
) => (scope: string) => infer A
  ? (...args: P) => A
  : never

/* eslint-disable @typescript-eslint/no-explicit-any */
function scopedMapDispatchToProps<
  OwnProps extends { scope: string },
  T extends Record<string, ActionCreator<any, any>>
>(
  mapEditorDispatchToProps: T
): MapDispatchToPropsParam<
  { [K in keyof T]: ScopedActionCreator<T[K]> },
  OwnProps
> {
  return (dispatch, { scope }) => {
    return R.map(
      mapper => (...args: Parameters<typeof mapper>) => {
        const action = mapper(...args)(scope)
        dispatch(action)
        return action
      },
      mapEditorDispatchToProps as any
    ) as any
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
