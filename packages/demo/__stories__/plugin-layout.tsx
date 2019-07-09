import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Editor } from '@edtr-io/core'
import { layoutPlugin } from '@edtr-io/plugin-layout'
import { plugins as coreplugins } from '../src/plugins'
import { SerloContainer } from '../src/container/serlo'
import { EditorStory } from '../src'

const plugins = { ...coreplugins, layout: layoutPlugin }
storiesOf('Plugins/Layout-Converter', module)
  .add('3 not even', () => {
    const state = {
      plugin: 'rows',
      state: [
        {
          plugin: 'layout',
          state: [
            {
              child: {
                plugin: 'image',
                state: {
                  src:
                    'https://upload.wikimedia.org/wikipedia/commons/e/e5/Augsburg_Tram_1.svg'
                }
              },
              width: 12
            },
            {
              child: {
                plugin: 'image',
                state: {
                  src:
                    'https://upload.wikimedia.org/wikipedia/commons/e/e0/Augsburg_Tram_2.svg'
                }
              },
              width: 8
            },
            {
              child: {
                plugin: 'image',
                state: {
                  src:
                    'https://upload.wikimedia.org/wikipedia/commons/4/47/Augsburg_Tram_3.svg'
                }
              },
              width: 4
            }
          ]
        }
      ]
    }
    return (
      <Editor plugins={plugins} defaultPlugin="layout" initialState={state}>
        {document => {
          return (
            <SerloContainer
              plugins={plugins}
              defaultPlugin="layout"
              initialState={state}
            >
              {document}
            </SerloContainer>
          )
        }}
      </Editor>
    )
  })
  .add('2 in a row, with rows', () => {
    const state = JSON.parse(
      '{"plugin":"rows","state":[{"plugin":"layout","state":[{"child":{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Dies ist ein mehrspaltiges Layout, wie es beim Konvertieren auf serlo.org verwendet wird.","marks":[]}]}]}]}}},{"plugin":"spoiler","state":{"title":"Geheimtipp","content":{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Durch klicken auf \\"konvertiere\\" wird das alles zu einem schönen, spaltenfreien Layout","marks":[]}]}]}]}}}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Das Plugin ist nur für Serlo relevant!","marks":[]}]}]}]}}}]},"width":12},{"child":{"plugin":"rows","state":[{"plugin":"image","state":{"src":"https://www.edutags.de/screenshots/30329_full.jpg","href":"","target":"","rel":"","description":"cooler Serlo content","maxWidth":0}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Das tolle Bild ist etwas klein... außer man konvertiert es! ","marks":[]}]}]}]}}}]},"width":12}]}]}'
    )
    return (
      <EditorStory
        plugins={plugins}
        defaultPlugin="text"
        initialState={state}
      />
    )
  })
