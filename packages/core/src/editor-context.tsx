import * as React from 'react'
import {
  Provider as ReduxProvider,
  connect as reduxConnect,
  MapDispatchToPropsParam,
  MapStateToPropsParam,
  ProviderProps,
  ReactReduxContextValue
} from 'react-redux'
import { State, Action } from './store'

export const EditorContext = React.createContext<ReactReduxContextValue>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  undefined as any
)

export function Provider(
  props: ProviderProps<Action> & { children: React.ReactNode }
) {
  return <ReduxProvider {...props} context={EditorContext} />
}
export function connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, State>,
  mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps>
) {
  return reduxConnect(mapStateToProps, mapDispatchToProps, null, {
    context: EditorContext
  })
}
export function connectStateOnly<StateProps, OwnProps>(
  mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, State>
) {
  return reduxConnect(mapStateToProps, null, null, {
    context: EditorContext
  })
}
