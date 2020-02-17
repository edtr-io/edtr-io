import * as React from 'react'

import { TextPluginConfig } from '.'

export const I18nContext = React.createContext<TextPluginConfig['i18n']>(
  (undefined as unknown) as TextPluginConfig['i18n']
)
