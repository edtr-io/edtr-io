import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Equations', module)
  .add('Initial State', () => {
    const state = {
      plugin: 'rows',
      state: [
        {
          plugin: 'equations'
        }
      ]
    }
    return <EditorStory initialState={state} />
  })
  .add('Prefilled Example', () => {
    const state = JSON.parse(
      '{"plugin":"rows","state":[{"plugin":"equations","state":{"steps":[{"left":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"3x + 1","marks":[]}]}]}]}}},"right":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"= 4","marks":[]}]}]}]}}},"transform":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"|-1","marks":[]}]}]}]}}}},{"left":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"3x","marks":[]}]}]}]}}},"right":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"= 3","marks":[]}]}]}]}}},"transform":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"|:3","marks":[]}]}]}]}}}},{"left":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"x","marks":[]}]}]}]}}},"right":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"= 1","marks":[]}]}]}]}}},"transform":{"plugin":"text","state":{"document":{"nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":""}]}]}]}}}}]}}]}'
    )

    return <EditorStory defaultPlugin="text" initialState={state} />
  })
  .add('Ugly Equation', () => {
    const state = JSON.parse(
      '{"plugin":"rows","state":[{"plugin":"equations","state":{"steps":[{"left":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"x+2-443233+x-777 =","marks":[]}]}]}]}}},"right":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"x+12342123-432","marks":[]}]}]}]}}},"transform":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Dies ist ein sehr langer hinweistext. er könnte sogar mehrzeilig werden. er sollte es bitte!","marks":[]}]}]}]}}}},{"left":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"x+2-443233+x-777 =x+2-443233+x-777 =","marks":[]}]}]}]}}},"right":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"x+12342123-432x+12342123-432x+12342123-432x+12342123-432x+12342123-432","marks":[]}]}]}]}}},"transform":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"a","marks":[]}]}]}]}}}},{"left":{"plugin":"text","state":{"document":{"nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":""}]}]}]}}},"right":{"plugin":"text","state":{"document":{"nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":""}]}]}]}}},"transform":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Dies ist ein sehr langer hinweistext. er könnte sogar mehrzeilig werden. er sollte es bitte!Dies ist ein sehr langer hinweistext. er könnte sogar mehrzeilig werden. er sollte es bitte!Dies ist ein sehr langer hinweistext. er könnte sogar mehrzeilig werden. er sollte es bitte!Dies ist ein sehr langer hinweistext. er könnte sogar mehrzeilig werden. er sollte es bitte!Dies ist ein sehr langer hinweistext. er könnte sogar mehrzeilig werden. er sollte es bitte!","marks":[]}]}]}]}}}}]}}]}'
    )

    return <EditorStory defaultPlugin="text" initialState={state} />
  })
