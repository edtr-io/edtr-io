import { AnchorConfig, AnchorPluginConfig } from '.'

export function useAnchorConfig(config: AnchorConfig): AnchorPluginConfig {
  const { i18n = {} } = config

  return {
    i18n: {
      label: 'Identifier',
      placeholder: 'ID of the anchor',
      ...i18n,
    },
  }
}
