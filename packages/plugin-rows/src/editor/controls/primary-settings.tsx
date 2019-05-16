import { styled } from '@edtr-io/editor-ui'

export const createPrimarySettingsWrapper = (props: { expanded: boolean }) => {
  return styled.div({
    transition: '250ms all ease-in-out',
    marginTop: '15px',
    display: props.expanded ? undefined : 'none'
  })
}
