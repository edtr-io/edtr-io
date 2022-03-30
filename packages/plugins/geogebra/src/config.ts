import { GeogebraConfig, GeogebraPluginConfig } from '.'

export function useGeogebraConfig(
  config: GeogebraConfig
): GeogebraPluginConfig {
  const { i18n = {} } = config

  return {
    i18n: {
      label: 'GeoGebra URL or ID',
      placeholder: '12345',
      ...i18n,
    },
  }
}
