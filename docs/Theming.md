# Theming

You can provide a theme for core editor and rendering UI elements

```typescript
interface Theme {
  editor: {
    backgroundColor: string
    color: string
    primary: {
      color: string
      background: string
    }
    secondary: {
      color: string
      background: string
    }
    success: {
      color: string
      background: string
    }
    info: {
      color: string
      background: string
    }
    warning: {
      color: string
      background: string
    }
    danger: {
      color: string
      background: string
    }
  }
  renderer: {
    backgroundColor: string
    color: string
    primary: {
      color: string
      background: string
    }
    secondary: {
      color: string
      background: string
    }
    success: {
      color: string
      background: string
    }
    info: {
      color: string
      background: string
    }
    warning: {
      color: string
      background: string
    }
    danger: {
      color: string
      background: string
    }
  }
  editorUi: DeepPartial<EditorUiTheme>
  rendererUi: DeepPartial<RendererUiTheme>
}
```

## Example

```typescript jsx
import * as React from 'react'
import { CustomTheme, ThemeProvider } from '@edtr-io/ui'

function Themed() {
  const theme: CustomTheme = {
    // Override shared theme for editor ui elements
    editor: {
      color: '#eeeeee',
      background: 'rgba(51,51,51,0.95)',
      primary: {
        background: 'rgb(70, 155, 255)'
      }
    },
    editorUi: {
      // Override the button editor ui element
      button: {
        background: 'red'
      }
    }
  }
  return <ThemeProvider theme={theme}>{/* render Editor here */}</ThemeProvider>
}
```
