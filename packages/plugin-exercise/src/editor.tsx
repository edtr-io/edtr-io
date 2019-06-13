import { StatefulPluginEditorProps } from '@edtr-io/core/src'
import { exerciseState } from '.'
import * as React from 'react'
import { styled } from '@edtr-io/ui'

const ShadowDiv = styled.div({
  boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.5)',
  padding: '10px',
  paddingBottom: 0
})

export function ExerciseEditor({
  state
}: StatefulPluginEditorProps<typeof exerciseState>) {
  return (
    <ShadowDiv>
      {state.question.render()}
      {state.solution.render()}
    </ShadowDiv>
  )
}
