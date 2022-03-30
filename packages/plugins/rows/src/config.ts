import { useTheme } from '@edtr-io/ui'
import * as R from 'ramda'

import { RowsConfig, RowsPluginConfig } from '.'

export function useRowsConfig(config: RowsConfig): RowsPluginConfig {
  const { i18n = {}, theme = {}, plugins } = config
  const { editor } = useTheme()

  return {
    plugins,
    i18n: R.mergeDeepRight(
      {
        menu: {
          searchPlaceholder: 'Search for tools…',
        },
        settings: {
          duplicateLabel: 'Duplicate',
          removeLabel: 'Remove',
          closeLabel: 'Close',
        },
        toolbar: {
          dragLabel: 'Drag the element within the document',
        },
        addLabel: 'Add an element',
      },
      i18n
    ),
    theme: R.mergeDeepRight(
      {
        color: editor.secondary.color,
        backgroundColor: editor.primary.color,
        highlightColor: editor.primary.background,
        lightBackgroundColor: 'rgb(182,182,182)',
        menu: {
          highlightColor: editor.primary.background,
          primary: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            color: editor.backgroundColor,
          },
          secondary: {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            color: '#999999',
          },
          dropzone: {
            backgroundColor: 'rgb(73, 73, 73)',
            color: '#dbdbdb',
            highlightColor: editor.primary.background,
            highlightBackgroundColor: 'rgb(60,60,60)',
          },
        },
      },
      theme
    ),
  }
}
