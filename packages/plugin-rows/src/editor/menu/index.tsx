import { selectors } from '@edtr-io/core'
import { styled, EdtrIcon, edtrRowsControls } from '@edtr-io/editor-ui'
import { ThemeProps } from '@edtr-io/ui'
import * as React from 'react'

import { createRowPluginTheme } from '../..'
import { Plugin } from './plugin'
import { Search } from './search'

const Wrapper = styled.div<{ name: string }>(
  ({ name, ...props }: ThemeProps & { name: string }) => {
    const theme = createRowPluginTheme(name, props.theme)
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
        padding: '25px 20px 0'
      }
    }
  }
)

const CloseButtonContainer = styled.div({
  position: 'absolute',
  top: '15px',
  right: '15px',
  width: '30px',
  cursor: 'pointer'
})

const PluginList = styled.div({
  display: 'flex',
  justifyContent: 'space-around',
  flexWrap: 'wrap',
  overflowY: 'auto',
  alignItems: 'stretch'
})

interface MenuProps {
  visible: boolean
  menu:
    | {
        index: number
        onClose: (pluginState: { plugin: string; state?: unknown }) => void
      }
    | undefined
  setMenu: (newMenu: MenuProps['menu']) => void
  plugins: ReturnType<typeof selectors['getPlugins']>
  name: string
}

export const Menu = ({ visible, menu, setMenu, plugins, name }: MenuProps) => {
  const [search, setSearch] = React.useState('')

  const close = React.useCallback(
    evt => {
      if (evt.key === 'Escape') setMenu(undefined)
    },
    [setMenu]
  )

  React.useEffect(() => {
    window.addEventListener('keydown', close)
    return () => {
      window.removeEventListener('keydown', close)
    }
  }, [close])

  if (!visible || !menu) return null
  const mappedPlugins = Object.keys(plugins)
    .filter(pluginKey => {
      const plugin = plugins[pluginKey]
      if (pluginKey === name || pluginKey === 'rows') return false
      if (!search.length) return true

      if (
        plugin.title &&
        plugin.title.toLowerCase().includes(search.toLowerCase())
      )
        return true
      if (
        plugin.description &&
        plugin.description.toLowerCase().includes(search.toLowerCase())
      )
        return true
      return pluginKey.toLowerCase().includes(search.toLowerCase())
    })
    .map(pluginName => (
      <Plugin
        onClick={() => menu.onClose({ plugin: pluginName })}
        key={pluginName}
        pluginName={pluginName}
        plugin={plugins[pluginName]}
        name={name}
      />
    ))
  return (
    <Wrapper name={name}>
      <Search search={search} name={name} setSearch={setSearch} />
      <PluginList>{mappedPlugins}</PluginList>
      <CloseButtonContainer onClick={() => setMenu(undefined)}>
        <EdtrIcon icon={edtrRowsControls.close} />
      </CloseButtonContainer>
    </Wrapper>
  )
}
