# Plugin API

A plugin exposes two mandatory parts to the editor and an optional callback

```
{
    Component: React.Component,
    state: StateType,
    onPaste?: (data: DataTransfer) => void | { state?: Serialized }
}
```
## Component

TODO

## state

See StateType docs

## onPaste

Everytime a user pastes data into a textplugin, the `onPaste` callback is called for every allowed plugin in the current environment. If a plugin handles the data a new plugin is inserted with the returned state.
The callback receives the pasted Data as a [DataTransfer](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer) object. 
The plugin should return void if it doesn't handle the pasted data or a object if it wants to be inserted instead. You can create and return a state from the pasted data, if the plugin should be prepopulated.

### Example

In a plugin embedding youtube videos the following `onPaste` function could be used 

```typescript
const youtubeState = StateType.string()
const youtubePlugin: StatefulPlugin<typeof geogebraState> = {
  Component: YoutubeEditorComponent, // some React component displaying the youtube video
  state: youtubeState,
  onPaste(clipboardData: DataTransfer) {
    const value = clipboardData.getData('text')

    const match = value.match(/(youtube\.com\/watch\?v=|youtu\.be\/)(.+)/)
    const videoId = match[2]
    if (match) {
      // insert a video plugin with the matched id at current cursor position
      return { state: videoId }  
    }
    // void return because the pasted data didn't match
  }
}
```