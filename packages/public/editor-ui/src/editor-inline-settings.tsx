import { styled } from '@edtr-io/ui'
import { StyledComponent } from 'styled-components'

/** @public */
// TODO: This is a workaround until API extractor supports import() types, see https://github.com/microsoft/rushstack/pull/1916
export const EditorInlineSettings: StyledComponent<'div', never> = styled.div({
  marginTop: '15px',
})
