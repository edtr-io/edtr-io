import { EditorThemeProps, styled } from '../theme'
import { createOverlayTheme } from './settings-overlay'

// Toolbar at the bottom of the browser.
export const BottomToolbar = styled.div<EditorThemeProps>(props => {
  const theme = createOverlayTheme(props.theme)
  return {
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.50)',
    backgroundColor: theme.backgroundColor,
    color: theme.color,
    borderRadius: '4px',
    position: 'fixed',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    bottom: '0',
    zIndex: 90,
    whiteSpace: 'nowrap'
  }
})
