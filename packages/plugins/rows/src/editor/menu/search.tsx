import { EdtrIcon, edtrRowsControls, styled } from '@edtr-io/ui'
import * as React from 'react'

import { RowsConfig } from '../..'

const StyledSearch = styled.div({
  paddingTop: '25px',
  paddingBottom: '25px',
  display: 'flex',
  justifyContent: 'center',
  width: '600px',
  '@media (max-width: 650px)': {
    width: '100%'
  }
})

const InputWrapper = styled.div({
  position: 'relative',
  width: '100%'
})

const StyledInput = styled.input<{ config: RowsConfig }>(({ config }) => {
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
      borderColor: theme.menu.highlightColor
    },

    '&::placeholder': {
      color: theme.menu.secondary.color
    }
  }
})

const ClearSearchContainer = styled.div<{
  visible: boolean
  config: RowsConfig
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
      color: theme.menu.highlightColor
    }
  }
})

const SearchIcon = styled(EdtrIcon)<{ config: RowsConfig }>(({ config }) => {
  const { theme } = config
  return {
    height: '55%',
    position: 'absolute',
    color: theme.menu.secondary.color,
    top: '50%',
    left: '5px',
    transform: 'translateY(-50%)'
  }
})

export const Search = ({
  search,
  setSearch,
  config
}: {
  search: string
  setSearch: (newValue: string) => void
  config: RowsConfig
}) => {
  return (
    <StyledSearch>
      <InputWrapper>
        <StyledInput
          config={config}
          placeholder="Suche hier nach Tools..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <ClearSearchContainer
          config={config}
          visible={search.length > 0}
          onClick={() => setSearch('')}
        >
          <EdtrIcon icon={edtrRowsControls.close} />
        </ClearSearchContainer>
        <SearchIcon config={config} icon={edtrRowsControls.search} />
      </InputWrapper>
    </StyledSearch>
  )
}
