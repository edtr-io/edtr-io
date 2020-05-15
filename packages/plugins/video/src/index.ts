import {
  EditorPlugin,
  EditorPluginProps,
  object,
  ObjectStateType,
  string,
  StringStateType,
} from '@edtr-io/plugin'
import { DeepPartial } from '@edtr-io/ui'
import * as R from 'ramda'

import { VideoEditor } from './editor'

/**
 * @param config - {@link VideoConfig | Plugin configuration}
 * @public
 */ export function createVideoPlugin(
  config: VideoConfig = {}
): EditorPlugin<VideoPluginState, VideoPluginConfig> {
  const { i18n = {} } = config

  return {
    Component: VideoEditor,
    config: {
      i18n: R.mergeDeepRight(
        {
          src: {
            label: 'Video URL',
          },
          alt: {
            label: 'Description',
          },
        },
        i18n
      ),
    },
    state: object({ src: string(), alt: string() }),
    onText(value) {
      const regex = /^(https?:\/\/)?(.*?(youtube\.com\/watch\?(.*&)?v=.+|youtu\.be\/.+|vimeo\.com\/.+|upload\.wikimedia\.org\/.+(\.webm|\.ogg)?|br\.de\/.+))/
      if (regex.test(value)) {
        return { state: { src: value, alt: '' } }
      }
    },
  }
}

/** @public */
export interface VideoConfig {
  i18n?: DeepPartial<VideoPluginConfig>
}

/** @public */
export type VideoPluginState = ObjectStateType<{
  src: StringStateType
  alt: StringStateType
}>

/** @public */
export interface VideoPluginConfig {
  i18n: {
    src: {
      label: string
    }
    alt: {
      label: string
    }
  }
}

/** @public */
export type VideoProps = EditorPluginProps<VideoPluginState, VideoPluginConfig>
