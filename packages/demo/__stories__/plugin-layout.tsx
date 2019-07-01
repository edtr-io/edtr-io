import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Editor } from '@edtr-io/core'
import { layoutPlugin } from '@edtr-io/plugin-layout'
import { anchorPlugin } from '@edtr-io/plugin-anchor'
import { SerloContainer } from '../src/container/serlo'

const plugins = { layout: layoutPlugin, anchor: anchorPlugin }
storiesOf('Plugins/Layout-Converter', module)
  .add('2 in a row', () => {
    // const state = JSON.parse(
    //   '{"plugin":"layout","state":[{"child":{"plugin":"anchor","state":""}, "width":"24"}]}'
    // )
    const state = {
      plugin: 'layout',
      state: [
        {
          child: {
            plugin: 'anchor'
          },
          width: 12
        },
        {
          child: {
            plugin: 'anchor'
          },
          width: 12
        }
      ]
    }
    return (
      <Editor plugins={plugins} defaultPlugin="layout" initialState={state}>
        {document => {
          return <SerloContainer>{document}</SerloContainer>
        }}
      </Editor>
    )
  })
  .add('3 not even', () => {
    // const state = JSON.parse(
    //   '{"plugin":"layout","state":[{"child":{"plugin":"anchor","state":""}, "width":"24"}]}'
    // )
    const state = {
      plugin: 'layout',
      state: [
        {
          child: {
            plugin: 'anchor'
          },
          width: 12
        },
        {
          child: {
            plugin: 'anchor'
          },
          width: 6
        },
        {
          child: {
            plugin: 'anchor'
          },
          width: 6
        }
      ]
    }
    return (
      <Editor plugins={plugins} defaultPlugin="layout" initialState={state}>
        {document => {
          return <SerloContainer>{document}</SerloContainer>
        }}
      </Editor>
    )
  })
