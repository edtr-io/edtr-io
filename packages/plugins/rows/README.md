## Rows Plugin for edtr-io

This plugin provides functionality of adding multiple rows of (different) plugins. Usage:

```typescript jsx
import { Editor } from '@edtr-io/core'
import { rowsPlugin } from '@edtr-io/plugin-rows'
import { textPlugin } from '@edtr-io/plugin-text'

// React FunctionComponent rendering the editor
const EdtrContainer = () => {
  //define the plugins for the editor
  const plugins = {
    rows: rowsPlugin,
    text: textPlugin
    //... further plugins
  }

  // create an empty initial State of the rows plugin
  const initialState = {
    plugin: 'rows'
  }
  // pass plugins and initialState to the rows plugin
  // also set a defaultPlugin which will be used in new rows by default
  return (
    <Editor
      plugins={plugins}
      defaultPlugin="text"
      initialState={initialState}
    />
  )
}
```

### Theming

You can customize the color set of the Rows Plugin by providing a theme (see [Theming Docs](https://github.com/edtr-io/edtr-io/blob/master/docs/Theming.md) for general usage instructions). The options for this plugin are:

```typescript jsx
export interface RowTheme {
  backgroundColor: string // default: editor.secondary.color = #333
  color: string // default: editor.primary.color = #fff
  highlightColor: string // default: editor.primary.background = #469bff
  lightBackgroundColor: string // default: #b6b6b6

  menu: {
    highlightColor: string // default: editor.primary.background = #469bff
    primary: {
      backgroundColor: string // default: rgba(255,255,255,0.95)
      color: string // default: theme.editor.backgroundColor rgba(51,51,51,0.95)
    }
    secondary: {
      backgroundColor: string // default: rgba(0, 0, 0, 0.1)
      color: string // default: #999
    }
    dropzone: {
      backgroundColor: string // default: rgb(73, 73, 73)
      color: string // default: #dbdbdb
      highlightColor: string // default: editor.primary.background = #469bff
      highlightBackgroundColor: string // default: rgb(60,60,60)
    }
  }
}
```
