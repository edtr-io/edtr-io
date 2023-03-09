import { styled, EdtrIcon, edtrClose } from '@edtr-io/ui'
import * as React from 'react'

import { RowsPluginConfig } from '../..'
import { Plugin } from './plugin'
import { Search } from './search'

const Wrapper = styled.div<{ config: RowsPluginConfig }>(({ config }) => {
  const { theme } = config
  return {
    display: 'flex',
    padding: '25px calc((100vw - 960px) / 2) 0',
    flexDirection: 'column',
    backgroundColor: theme.menu.primary.backgroundColor,
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,

    '@media (max-width: 1000px)': {
      padding: '25px 20px 0',
    },
  }
})

const CloseButtonContainer = styled.div({
  position: 'absolute',
  top: '15px',
  right: '15px',
  width: '30px',
  cursor: 'pointer',
})

const PluginList = styled.div({
  display: 'flex',
  justifyContent: 'space-around',
  flexWrap: 'wrap',
  overflowY: 'auto',
  alignItems: 'stretch',
})

interface MenuProps {
  menu: {
    index: number
    onClose: (pluginState: { plugin: string; state?: unknown }) => void
  }
  setMenu: (newMenu?: MenuProps['menu']) => void
  config: RowsPluginConfig
}

export function Menu({ menu, setMenu, config }: MenuProps) {
  const [search, setSearch] = React.useState('')

  const close = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenu(undefined)
    },
    [setMenu]
  )

  React.useEffect(() => {
    window.addEventListener('keydown', close)
    return () => {
      window.removeEventListener('keydown', close)
    }
  }, [close])

  const mappedPlugins = config.plugins
    .filter(({ name: pluginKey, title, description }) => {
      if (!search.length) return true

      if (title && title.toLowerCase().includes(search.toLowerCase()))
        return true
      if (
        description &&
        description.toLowerCase().includes(search.toLowerCase())
      )
        return true
      return pluginKey.toLowerCase().includes(search.toLowerCase())
    })
    .map((plugin) => (
      <Plugin
        config={config}
        onClick={() => menu.onClose({ plugin: plugin.name })}
        key={plugin.name}
        pluginName={plugin.name}
        plugin={plugin}
      />
    ))
  return (
    <Wrapper config={config}>
      <Search config={config} search={search} setSearch={setSearch} />
      <PluginList>{mappedPlugins}</PluginList>
      <CloseButtonContainer onClick={() => setMenu(undefined)}>
        <EdtrIcon icon={edtrClose} />
      </CloseButtonContainer>
    </Wrapper>
  )
}
