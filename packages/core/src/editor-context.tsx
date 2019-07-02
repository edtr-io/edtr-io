import * as R from 'ramda'
import * as React from 'react'
import {
  Provider as ReduxProvider,
  connect as reduxConnect,
  MapDispatchToPropsParam,
  MapStateToPropsParam,
  ProviderProps,
  ReactReduxContextValue,
  MapStateToProps
} from 'react-redux'
import { Action, EditorState, StoreState } from './store'
import { ActionCreator } from './store/helpers'

export const ScopeContext = React.createContext<string>('')
export const EditableContext = React.createContext(true)

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
  ReturnType<ActionCreator<any, any>>
>
  ? { [K in keyof T]: ((scope: string) => T[K]) & { type: string } }
  : never

export function connect<
  StateProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DispatchProps extends Record<string, ReturnType<ActionCreator<any, any>>>,
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
    return mapEditorStateToProps(state[props.scope], props)
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function scopedMapDispatchToProps<
  OwnProps extends { scope: string },
  T extends Record<string, ActionCreator<any, any>>
>(
  mapEditorDispatchToProps: T
): MapDispatchToPropsParam<{ [K in keyof T]: ReturnType<T[K]> }, OwnProps> {
  return (dispatch, { scope }) => {
    return R.map(
      mapper => (...args: any) => dispatch(mapper(scope)(...args)),
      mapEditorDispatchToProps as any
    ) as any
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
