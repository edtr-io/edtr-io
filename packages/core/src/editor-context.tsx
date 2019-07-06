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
import { Action, EditorState, ScopeState } from './store'
import { getScope } from './store/reducer'
import {
  ActionCreator,
  ScopedActionCreator,
  UnscopedActionCreator
} from './store/types'

export const ScopeContext = React.createContext<{
  scope: string
  editable?: boolean
}>({ scope: '' })

export const EditorContext = React.createContext<
  ReactReduxContextValue<EditorState>
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  undefined as any
)

export function Provider(
  props: ProviderProps<Action> & { children: React.ReactNode }
) {
  return <ReduxProvider {...props} context={EditorContext} />
}

export function connect<
  StateProps,
  DispatchProps extends Record<string, ScopedActionCreator>,
  OwnProps extends { scope: string }
>(
  mapStateToProps: MapStateToProps<StateProps, OwnProps, ScopeState>,
  mapDispatchToProps: {
    [K in keyof DispatchProps]: UnscopedActionCreator<DispatchProps[K]>
  }
) {
  return reduxConnect(
    scopedMapStateToProps(mapStateToProps),
    scopedMapDispatchToProps<
      OwnProps,
      { [K in keyof DispatchProps]: UnscopedActionCreator<DispatchProps[K]> }
    >(mapDispatchToProps),
    null,
    {
      context: EditorContext
    }
  )
}

export function connectStateOnly<
  StateProps,
  OwnProps extends { scope: string }
>(mapStateToProps: MapStateToProps<StateProps, OwnProps, ScopeState>) {
  return reduxConnect(scopedMapStateToProps(mapStateToProps), null, null, {
    context: EditorContext
  })
}

function scopedMapStateToProps<StateProps, OwnProps extends { scope: string }>(
  mapEditorStateToProps: MapStateToProps<StateProps, OwnProps, ScopeState>
): MapStateToPropsParam<StateProps, OwnProps, EditorState> {
  return (state, props) => {
    return mapEditorStateToProps(getScope(state, props.scope), props)
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function scopedMapDispatchToProps<
  OwnProps extends { scope: string },
  T extends Record<string, ActionCreator>
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
