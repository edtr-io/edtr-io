import { createDocument, Editor, Plugin } from '@edtr-io/core'
import { createImagePlugin, UploadConfig } from '@edtr-io/plugin-image'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

const uploadConfig: UploadConfig = {
  url: 'https://de.serlo.org/attachment/upload',
  paramName: 'attachment[file]',
  maxFileSize: 2 * 1024 * 1024,
  allowedExtensions: ['gif', 'jpg', 'jpeg', 'png', 'svg'],
  getAdditionalFields: () => {
    return {
      type: 'file',
      csrf: ((window as unknown) as { csrf: string }).csrf
    }
  },
  getStateFromResponse: (response: { files: Array<{ location: string }> }) => {
    return {
      src: response.files[0].location
    }
  }
}
const plugins: Record<string, Plugin<any>> = {
  image: createImagePlugin({ upload: uploadConfig })
}
storiesOf('ImagePlugin', module).add('Empty example', () => {
  const state = createDocument({
    plugin: 'image'
  })
  return <Editor plugins={plugins} defaultPlugin="image" state={state} />
})
