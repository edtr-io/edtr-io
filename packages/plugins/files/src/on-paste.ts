export function onPaste(clipboardData: DataTransfer) {
  const files = getFilesFromDataTransfer(clipboardData)
  if (files.length) {
    return {
      state: files.map(file => ({ pending: file }))
    }
  }
}

export function getFilesFromDataTransfer(clipboardData: DataTransfer) {
  const items = clipboardData.files
  const files: File[] = []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (!item) continue
    files.push(item)
  }
  return files
}
