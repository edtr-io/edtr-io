import { ResponsiveIframe } from '@edtr-io/renderer-ui'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

storiesOf('Renderer UI/Iframe', module).add('Fixed aspect ratio', () => {
  const html = `<html><body style="background: red;"></body></html>`
  return (
    <React.Fragment>
      <div
        style={{
          width: '400px',
          margin: '0 auto'
        }}
      >
        <h2>4:3</h2>
        <ResponsiveIframe
          src={createDataSrc(html)}
          initialAspectRatio={4 / 3}
        />
      </div>
      <div
        style={{
          width: '400px',
          margin: '0 auto'
        }}
      >
        <h2>16:9</h2>
        <ResponsiveIframe
          src={createDataSrc(html)}
          initialAspectRatio={16 / 9}
        />
      </div>
      <div
        style={{
          width: '400px',
          margin: '0 auto'
        }}
      >
        <h2>21:9</h2>
        <ResponsiveIframe
          src={createDataSrc(html)}
          initialAspectRatio={21 / 9}
        />
      </div>
    </React.Fragment>
  )
})

function createDataSrc(html: string) {
  return `data:text/html;charset=utf-8,${html}`
}
