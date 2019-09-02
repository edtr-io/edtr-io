import * as React from 'react'

export interface Preference {
  visualMath: boolean
  setVisualMath: any
}

export const PreferenceContext = React.createContext<Preference>({
  visualMath: true,
  setVisualMath: () => {}
})
