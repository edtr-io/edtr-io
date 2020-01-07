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
