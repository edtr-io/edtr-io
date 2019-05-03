import { StateType, StatefulPlugin } from '@edtr-io/core'

import { H5pEditor } from './editor'

export const h5pState = StateType.object({
  src: StateType.string('')
})

export const h5pPlugin: StatefulPlugin<typeof h5pState> = {
  Component: H5pEditor,
  title: 'H5P Plugin',
  description: 'Füge Inhalte von H5P via ID oder Link ein.',
  state: h5pState
}
