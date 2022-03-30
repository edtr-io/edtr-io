import * as R from 'ramda'

import { ImageConfig, ImagePluginConfig } from '.'

export function useImageConfig(config: ImageConfig): ImagePluginConfig {
  const { i18n = {} } = config

  return {
    ...config,
    i18n: R.mergeDeepRight(
      {
        label: 'Browse…',
        failedUploadMessage: 'Upload failed',
        src: {
          label: 'Image URL',
          placeholder: {
            empty: 'https://example.com/image.png',
            uploading: 'Uploading…',
            failed: 'Upload failed…',
          },
          retryLabel: 'Retry',
        },
        link: {
          href: {
            label: 'Link',
            placeholder: 'Link the image',
          },
          openInNewTab: {
            label: 'Open in new tab',
          },
        },
        alt: {
          label: 'Description',
          placeholder: 'Enter an image description',
        },
        maxWidth: {
          label: 'Maximum width',
          placeholder: 'Enter the maximum width',
        },
      },
      i18n
    ),
  }
}
