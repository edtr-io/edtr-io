import { FilesConfig, FilesPluginConfig } from '.'

export function useFilesConfig(config: FilesConfig): FilesPluginConfig {
  const { i18n = {} } = config

  return {
    upload: config.upload,
    i18n: {
      label: 'Browse…',
      failedUploadMessage: 'Upload failed',
      ...i18n,
    },
  }
}
