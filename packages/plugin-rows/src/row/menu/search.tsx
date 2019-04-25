import * as React from 'react'
import { styled, ThemeProps } from '@edtr-io/ui'
import { faSearch, Icon, faTimes } from '@edtr-io/editor-ui'
import { createRowPluginTheme } from '@edtr-io/plugin-rows'

const StyledSearch = styled.div({
  paddingTop: '25px',
  paddingBottom: '25px',
  display: 'flex',
  justifyContent: 'center'
})

const InputWrapper = styled.div({
  position: 'relative',
  width: '100%'
})

const StyledInput = styled.input(
  ({ name, ...props }: { name: string } & ThemeProps) => {
    const theme = createRowPluginTheme(name, props.theme)
    return {
      padding: '5px 40px',
      border: `2px solid ${theme.menu.primary.color}`,
      borderRadius: '5px',
      fontSize: '20px',
      outline: 'none',
      backgroundColor: 'transparent',
      transition: '250ms all ease-in-out',
      width: '100%',

      '&:focus': {
        borderColor: theme.menu.highlightColor
      },

      '&::placeholder': {
        color: theme.menu.primary.color
      }
    }
  }
)

const ClearSearchContainer = styled.div<{ visible: boolean; name: string }>(
  props => {
    const theme = createRowPluginTheme(name, props.theme)
    return {
      height: '70%',
      position: 'absolute',
      top: '50%',
      right: '10px',
      transform: 'translateY(-50%)',
      opacity: props.visible ? 0.4 : 0,
      transition: '250ms all ease-in-out',
      cursor: 'pointer',
      color: theme.menu.secondary.color,

      '&:hover': {
        opacity: props.visible ? 0.6 : 0,
        color: theme.menu.highlightColor
      }
    }
  }
)

const SearchIcon = styled(Icon)(
  ({ name, ...props }: { name: string } & ThemeProps) => {
    const theme = createRowPluginTheme(name, props.theme)
    return {
      height: '70%',
      position: 'absolute',
      color: theme.menu.secondary.color,
      top: '50%',
      left: '5px',
      transform: 'translateY(-50%)',
      opacity: 0.4
    }
  }
)

export const Search = ({
  search,
  setSearch,
  name
}: {
  search: string
  setSearch: (newValue: string) => void
  name: string
}) => {
  return (
    <StyledSearch>
      <InputWrapper>
        <StyledInput
          name={name}
          placeholder="Suche hier nach Tools..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <ClearSearchContainer
          name={name}
          visible={search.length > 0}
          onClick={() => setSearch('')}
        >
          <Icon icon={faTimes} size="2x" />
        </ClearSearchContainer>
        <SearchIcon name={name} icon={faSearch} size="2x" />
      </InputWrapper>
    </StyledSearch>
  )
}
