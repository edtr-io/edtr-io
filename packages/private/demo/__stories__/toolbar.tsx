import { PluginToolbarButton } from '@edtr-io/core'
import { EditorPlugin, number } from '@edtr-io/plugin'
import { styled } from '@edtr-io/ui'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

const state = {
  plugin: 'counter',
  state: 0
}

const ToolbarIcon = styled.div({
  backgroundColor: '#aaa',
  width: '20px',
  borderRadius: '3px',
  margin: '2px'
})

const counterState = number()
const counterPlugin: EditorPlugin<typeof counterState> = {
  Component: function Counter(props) {
    return (
      <div>
        Counter: {props.state.value}
        {props.renderIntoToolbar(
          <React.Fragment>
            <PluginToolbarButton
              icon={<ToolbarIcon>+</ToolbarIcon>}
              onClick={() => props.state.set(val => val + 1)}
              label="Increment"
            />
            <PluginToolbarButton
              icon={<ToolbarIcon>-</ToolbarIcon>}
              onClick={() => props.state.set(val => val - 1)}
              label="Decrement"
            />
          </React.Fragment>
        )}
      </div>
    )
  },
  state: counterState,
  config: {}
}

storiesOf('Toolbar', module).add('Plugin with renderIntoToolbar', () => {
  return (
    <EditorStory
      plugins={{
        counter: counterPlugin
      }}
      initialState={state}
      onChange={action('changed')}
    />
  )
})
