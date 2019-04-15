import { storiesOf } from '@storybook/react'
import * as React from 'react'

const scriptRef: React.MutableRefObject<HTMLScriptElement | null> = React.createRef()
function loadGeogebra(): Promise<void> {
  return new Promise(resolve => {
    if (scriptRef.current) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.geogebra.org/apps/deployggb.js'
    scriptRef.current = script
    script.onload = () => {
      resolve()
    }

    document.body.appendChild(script)
  })
}

function GeoGebra({ type }: GeoGebraProps) {
  const [app, setApp] = React.useState(null)
  React.useEffect(() => {
    loadGeogebra().then(() => {
      const app = new GGBApplet(
        {
          appName: type
          // FIXME
          // enableFileFeatures: true,
          // width: 800,
          // height: 600,
          // showToolBar: true,
          // showAlgebraInput: true,
          // showMenuBar: true
        },
        true
      )
      setApp(app)
    })
  }, [type])

  if (!app) {
    return null
  }

  return (
    <div
      ref={ref => {
        app.inject(ref)
      }}
    />
  )
}

interface GeoGebraProps {
  type: 'graphing' | 'geometry' | '3d' | 'classic'
}

storiesOf('GeoGebra', module).add('Foo', () => {
  return (
    <React.Fragment>
      <GeoGebra type="graphing" />
      <GeoGebra type="geometry" />
      <GeoGebra type="3d" />
      <GeoGebra type="classic" />
    </React.Fragment>
  )
})
