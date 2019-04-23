import React, { useState, useCallback, useEffect } from 'react'
import { styled } from '@edtr-io/ui'
import { Portal } from 'react-portal'
import { getPlugins, PluginState } from '@edtr-io/core'

import { Clipboard } from '../clipboard'
import { Search } from './search'
import { Plugin } from './plugin'
import { Dropzone } from './dropzone'
import { State } from '@edtr-io/core/src/store'

const Wrapper = styled.div({
  display: 'flex',
  padding: '25px calc((100vw - 960px) / 2) 150px',
  paddingBottom: '155px',
  flexDirection: 'column',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100vh',
  zIndex: 9999,

  '@media (max-width: 1000px)': {
    padding: '25px 20px 155px'
  }
})

const CloseButton = styled.img({
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
    | { index: number; onClose: (pluginState: PluginState) => void }
    | undefined
  setMenu: (newMenu: MenuProps['menu']) => void
  state: State
  name?: string
}

export const Menu = ({ visible, menu, setMenu, state, name }: MenuProps) => {
  const [search, setSearch] = useState('')

  const close = useCallback(
    evt => {
      if (evt.key === 'Escape') setMenu(undefined)
    },
    [setMenu]
  )

  useEffect(() => {
    if (visible) document.body.style.position = 'fixed'
    window.addEventListener('keydown', close)
    return () => {
      window.removeEventListener('keydown', close)
      document.body.style.position = 'static'
    }
  }, [close, visible])

  if (!visible || !menu) return null
  const plugins = getPlugins(state)
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
      if (pluginKey.toLowerCase().includes(search.toLowerCase())) return true
      return false
    })
    .map(pluginName => (
      <Plugin
        onClick={() => menu.onClose({ plugin: pluginName })}
        key={pluginName}
        pluginName={pluginName}
        plugin={plugins[pluginName]}
      />
    ))
  return (
    <Portal>
      <Wrapper>
        <Search search={search} setSearch={setSearch} />
        <Clipboard onClose={menu.onClose} />
        <PluginList>{mappedPlugins}</PluginList>
        <Dropzone />
        <CloseButton
          onClick={() => setMenu(undefined)}
          src={require('../../../assets/close.svg')}
        />
      </Wrapper>
    </Portal>
  )
}
