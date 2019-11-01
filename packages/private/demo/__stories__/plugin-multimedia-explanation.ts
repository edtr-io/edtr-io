import { addStory } from '../src'

addStory('Plugins/Multimedia Explanation/Initial State', {
  state: {
    plugin: 'rows',
    state: [
      {
        plugin: 'multimediaExplanation'
      }
    ]
  }
})

addStory('Plugins/Multimedia Explanation/Prefilled Illustrating Image', {
  state: {
    plugin: 'rows',
    state: [
      {
        plugin: 'multimediaExplanation',
        state: {
          explanation: { plugin: 'rows', state: [{ plugin: 'text' }] },
          multimedia: {
            plugin: 'image',
            state: {
              src:
                'https://packages.serlo.org/athene2-assets@a/serlo_learning_lg.ee37b05f.jpg',
              href: '',
              target: '',
              rel: '',
              description: 'Ein Schüler lernt mit serlo.org',
              maxWidth: 0
            }
          },
          illustrating: true,
          width: 50
        }
      }
    ]
  }
})

addStory('Plugins/Multimedia Explanation/Prefilled Explaining Image', {
  state: {
    plugin: 'rows',
    state: [
      {
        plugin: 'multimediaExplanation',
        state: {
          explanation: { plugin: 'rows', state: [{ plugin: 'text' }] },
          multimedia: {
            plugin: 'image',
            state: {
              src:
                'https://packages.serlo.org/athene2-assets@a/serlo_learning_lg.ee37b05f.jpg',
              href: '',
              target: '',
              rel: '',
              description: 'Ein Schüler lernt mit serlo.org',
              maxWidth: 300
            }
          },
          illustrating: false,
          width: 50
        }
      }
    ]
  }
})
