import {EditorContext, EditorProvider} from '@edtr-io/core'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import {Document, createDocumentIdentifier} from "../../core/src/document";

const plugins = {
  stateless: {
    Component: () => null
  },
  stateful: {
    Component: () => null,
    createInitialState: () => {
      return { counter: 0 }
    }
  }
}

storiesOf('EditorProvider', module).add('foo', () => {
  return (
    <EditorProvider plugins={plugins} defaultPlugin="stateless">
      <Document state={createDocumentIdentifier()}/>
    </EditorProvider>
  )
})
