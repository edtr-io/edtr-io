import { edtrClose, EdtrIcon, edtrSearch, styled } from '@edtr-io/ui'
import * as React from 'react'

import { RowsPluginConfig } from '../..'

const StyledSearch = styled.div({
  paddingTop: '25px',
  paddingBottom: '25px',
  display: 'flex',
  justifyContent: 'center',
  width: '600px',
  '@media (max-width: 650px)': {
    width: '100%',
  },
})

const InputWrapper = styled.div({
  position: 'relative',
  width: '100%',
})

const StyledInput = styled.input<{ config: RowsPluginConfig }>(({ config }) => {
  const { theme } = config
  return {
    padding: '5px 30px',
    border: `2px solid ${theme.menu.secondary.color}`,
    borderRadius: '5px',
    fontSize: '20px',
    outline: 'none',
    backgroundColor: theme.menu.primary.backgroundColor,
    transition: '250ms all ease-in-out',
    width: '100%',

    '&:focus': {
      borderColor: theme.menu.highlightColor,
    },

    '&::placeholder': {
      color: theme.menu.secondary.color,
    },
  }
})

const ClearSearchContainer = styled.div<{
  visible: boolean
  config: RowsPluginConfig
}>(({ config, visible }) => {
  const { theme } = config
  return {
    height: '55%',
    position: 'absolute',
    top: '50%',
    right: '5px',
    transform: 'translateY(-50%)',
    opacity: visible ? 1 : 0,
    transition: '250ms all ease-in-out',
    cursor: 'pointer',
    color: theme.menu.secondary.color,

    '&:hover': {
      color: theme.menu.highlightColor,
    },
  }
})

const SearchIcon = styled(EdtrIcon)<{ config: RowsPluginConfig }>(
  ({ config }) => {
    const { theme } = config
    return {
      height: '55%',
      position: 'absolute',
      color: theme.menu.secondary.color,
      top: '50%',
      left: '5px',
      transform: 'translateY(-50%)',
    }
  }
)

export const Search = ({
  search,
  setSearch,
  config,
}: {
  search: string
  setSearch: (newValue: string) => void
  config: RowsPluginConfig
}) => {
  return (
    <StyledSearch>
      <InputWrapper>
        <StyledInput
          config={config}
          placeholder={config.i18n.menu.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ClearSearchContainer
          config={config}
          visible={search.length > 0}
          onClick={() => setSearch('')}
        >
          <EdtrIcon icon={edtrClose} />
        </ClearSearchContainer>
        <SearchIcon config={config} icon={edtrSearch} />
      </InputWrapper>
    </StyledSearch>
  )
}
