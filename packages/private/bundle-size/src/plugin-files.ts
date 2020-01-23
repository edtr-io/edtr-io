import { LoadedFile } from '@edtr-io/plugin'
import {
  createFilesPlugin,
  parseFileType,
  UploadedFile
} from '@edtr-io/plugin-files'

export const filesPlugin = createFilesPlugin({ upload: mockUploadFileHandler })

function mockUploadFileHandler(file: File): Promise<UploadedFile> {
  return readFile(file).then(loaded => {
    return {
      src: loaded.dataUrl,
      name: loaded.file.name,
      type: parseFileType(loaded.file.name)
    }
  })
}

function readFile(file: File): Promise<LoadedFile> {
  return new Promise(resolve => {
    const reader = new FileReader()

    reader.onload = function(e: ProgressEvent) {
      if (!e.target) return
      const { result } = (e.target as unknown) as { result: string }
      const dataUrl = result
      // Simulate upload time
      setTimeout(() => resolve({ file, dataUrl }), 1000)
    }

    reader.readAsDataURL(file)
  })
}
