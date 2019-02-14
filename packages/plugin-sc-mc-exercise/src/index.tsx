import {
  useLeaf,
  useChild,
  createLeaf,
  createChild,
  createObject,
  createList,
  Blackbox
} from '@edtr-io/core'
import * as React from 'react'
import * as R from 'ramda'
export const ScMcExercisePlugin = {}

export function ScMcComponent(props: Blackbox) {
  const createAnswer = createObject([
    { key: 'content', hook: createChild() },
    { key: 'isCorrect', hook: createLeaf(false) },
    { key: 'feedback', hook: createChild() }
  ])
  const state = createObject([
    { key: 'isSingleChoice', hook: createLeaf(true) },
    { key: 'answers', hook: createList(createAnswer) }
  ])(props)
  return (
    <React.Fragment>
      {R.map(answer => {
        return (
          <React.Fragment>
            <div>{answer.content.render()}</div>
            <div>{answer.feedback.render()}</div>
          </React.Fragment>
        )
      }, state.answers)}
    </React.Fragment>
  )
}
