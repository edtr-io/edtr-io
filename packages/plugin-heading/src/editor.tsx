import * as React from 'react'
import { StatefulPluginEditorProps } from '@edtr-io/core'
import { headingState, HeadingContext } from '.'
import { styled } from '@edtr-io/ui'

const HeadingBox = styled.div({
  borderLeft: '5px solid lightgrey',
  marginLeft: '10px',
  paddingBottom: '20px'
})
const Heading = ({
  level,
  children
}: {
  level: number
  children: React.ReactNode
}) => {
  if (level <= 6 && level >= 1)
    return React.createElement(`h${level}`, null, children)
  else return React.createElement(`h6`, null, children)
}
export const HeadingEditor = (
  props: StatefulPluginEditorProps<typeof headingState>
) => {
  const { state, editable } = props
  const currentLevel = React.useContext(HeadingContext).level

  return (
    <HeadingContext.Provider value={{ level: currentLevel + 1 }}>
      {editable ? (
        <HeadingBox>
          <Heading level={currentLevel}>
            <input
              value={state.text()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                state.text.set(e.target.value)
              }
            />
          </Heading>
          {state.content.render()}
        </HeadingBox>
      ) : (
        <HeadingRenderer level={currentLevel} state={state} />
      )}
    </HeadingContext.Provider>
  )
}

export function HeadingRenderer(props: HeadingRendererProps) {
  return (
    <React.Fragment>
      <Heading level={props.level}> {props.state.text()} </Heading>{' '}
      {props.state.content.render()}
    </React.Fragment>
  )
}

type HeadingRendererProps = StatefulPluginEditorProps<typeof headingState> & {
  level: number
}
