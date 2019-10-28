import { withKnobs } from '@storybook/addon-knobs'
import { addDecorator, addParameters, configure } from '@storybook/react'

import { theme } from './theme'

const req = require.context('../__stories__', true, /\.tsx?$/)

addDecorator(withKnobs)
addParameters({
  options: { addonPanelInRight: true, theme }
})
configure(loadStories, module)

function loadStories() {
  req.keys().forEach(filename => req(filename))
}
