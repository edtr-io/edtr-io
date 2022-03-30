import { SerloInjectionConfig, SerloInjectionPluginConfig } from '.'

export function useSerloInjectionConfig(
  config: SerloInjectionConfig
): SerloInjectionPluginConfig {
  const { i18n = {} } = config

  return {
    i18n: {
      label: 'Serlo ID',
      placeholder: '123456',
      ...i18n,
    },
  }
}
