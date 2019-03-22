import { addParameters, configure } from '@storybook/react'

const req = require.context('../__stories__', true, /\.tsx$/)

addParameters({
  options: {
    name: 'Edtr.io',
    url: 'https://edtr.io',
    showAddonPanel: false
  }
})
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
