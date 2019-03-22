# Theming 

You can provide a theme for the main editor UI elements

```typescript
interface EditorTheming {
  highlightColor: string
  textColor: string
  backgroundColor: string
  buttonBackgroundColor: string
}
```

## Example
```typescript
import * as React from 'react'
import { ThemeProvider } from 'styled-components'
import { EditorTheming } from '@edtr-io/ui'

const Themed : React.FunctionComponent = () => {
  const theme: EditorTheming = { //this is the default theme
    highlightColor: 'rgb(70, 155, 255)',
    textColor: '#EEEEEE',
    backgroundColor: 'rgb(51,51,51,0.95)',
    buttonBackgroundColor: 'transparent'
  }
  return (
    <ThemeProvider theme={theme}>
      {/* render Editor here */}
    </ThemeProvider>
  )
}
```