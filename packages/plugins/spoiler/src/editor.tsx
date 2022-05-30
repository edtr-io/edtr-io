import { ExpandableBox } from '@edtr-io/renderer-ui'
import { ThemeProvider } from '@edtr-io/ui'
import * as React from 'react'

import { SpoilerProps } from '.'
import { useSpoilerConfig } from './config'

export function SpoilerEditor(props: SpoilerProps) {
  const { state, editable } = props
  const config = useSpoilerConfig(props.config)
  const { theme } = config
  const spoilerTheme = React.useMemo(() => {
    return {
      rendererUi: {
        expandableBox: {
          toggleBackgroundColor: theme.color,
          toggleColor: '#333',
          containerBorderColor: theme.color,
        },
      },
    }
  }, [theme])

  return (
    <ThemeProvider theme={spoilerTheme}>
      <ExpandableBox
        renderTitle={() =>
          state.title.render({
            config: { placeholder: config.i18n.title.placeholder },
          })
        }
        editable={editable}
        alwaysVisible
      >
        {state.content.render()}
      </ExpandableBox>
    </ThemeProvider>
  )
}
