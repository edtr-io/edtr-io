import { LoadedFile, StateTypeSerializedType } from '@edtr-io/plugin'

import {
  createFilesPlugin,
  FilesPluginState,
  FileType,
  parseFileType,
  UploadedFile,
} from '../src'

export const name = 'files'
export const plugin = createFilesPlugin({
  upload: mockUploadFileHandler,
})

export const states: Record<
  string,
  StateTypeSerializedType<FilesPluginState>
> = {
  simple: [
    {
      type: FileType.Image,
      name: 'foo',
      src:
        'https://raw.githubusercontent.com/edtr-io/edtr-io/master/README_files/edtrio_full.svg?sanitize=true',
    },
  ],
}

function mockUploadFileHandler(file: File): Promise<UploadedFile> {
  return readFile(file).then((loaded) => {
    return {
      src: loaded.dataUrl,
      name: loaded.file.name,
      type: parseFileType(loaded.file.name),
    }
  })
}

function readFile(file: File): Promise<LoadedFile> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = function (e: ProgressEvent) {
      if (!e.target) return
      const { result } = (e.target as unknown) as { result: string }
      const dataUrl = result
      // Simulate upload time
      setTimeout(() => resolve({ file, dataUrl }), 1000)
    }

    reader.readAsDataURL(file)
  })
}
