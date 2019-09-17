import { addStory } from '../src'

addStory('Plugins/Image/Initial State', {
  state: {
    plugin: 'rows',
    state: [
      {
        plugin: 'image'
      }
    ]
  }
})

addStory('Plugins/Image/Prefilled (Image Description)', {
  state: {
    plugin: 'rows',
    state: [
      {
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
      }
    ]
  }
})

addStory('Plugins/Image/Prefilled (Image Link)', {
  state: {
    plugin: 'rows',
    state: [
      {
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
      }
    ]
  }
})

addStory('Plugins/Image/without rows', {
  state: {
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
  }
})
