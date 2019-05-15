import { ResponsiveIframe } from '@edtr-io/renderer-ui'
import { styled } from '@edtr-io/ui'
import { storiesOf } from '@storybook/react'
// import * as R from 'ramda'
import * as React from 'react'

let promiseRef: React.MutableRefObject<Promise<void> | null> = React.createRef()

/** @see https://wiki.geogebra.org/en/Reference:GeoGebra_Apps_Embedding */
/** @see https://wiki.geogebra.org/en/Reference:GeoGebra_Apps_API */

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
declare class GGBApplet {
  /**
   * @param options  An object containing parameters that are passed to the applet (see https://wiki.geogebra.org/en/Reference:GeoGebra_App_Parameters).
   * @param views  An object containing information about which views are used in the GeoGebra worksheet. Each variable is boolean.
   * @param html5NoWebSimple  Set to true to avoid using web Simple for simple html5 applets. In this case the full version is used always.
   */
  public constructor(
    options: GGBAppletOptions | {},
    views: GGBAppletViews | null,
    html5NoWebSimple?: boolean
  )

  public inject(element: HTMLElement): void

  /** @see https://wiki.geogebra.org/en/Reference:GeoGebra_Apps_API */
  public setWidth(width: number): void
}

function createGeogebraApplet({
  options,
  views,
  html5NoWebSimple
}: GeogebraAppletOptions): GGBApplet {
  return new GGBApplet(options || {}, views || null, html5NoWebSimple)
}
interface GeogebraAppletOptions {
  options?: GGBAppletOptions
  views?: GGBAppletViews
  html5NoWebSimple?: boolean
}

/** @see https://wiki.geogebra.org/en/Reference:GeoGebra_App_Parameters */
interface GGBAppletOptions {
  appName?: 'classic' | 'graphing' | 'geometry' | '3d'

  // TODO: this seems to be required. If possible, we'd like to have auto-scaling
  width?: unknown
  height?: unknown

  material_id?: string
  filename?: string
  ggbBase64?: string
  borderColor?: string
  enableRightClick?: boolean
  enableLabelDrags?: boolean
  enableShiftDragZoom?: boolean
  showZoomButtons?: boolean
  errorDialogsActive?: boolean
  showMenuBar?: boolean
  showToolBar?: boolean
  showToolBarHelp?: boolean
  customToolbar?: string
  showAlgebraInput?: string
  showResetIcon?: string
  language?: string
  country?: string
  id?: string
  allowStyleBar?: boolean
  appletOnLoad?(api: unknown): void
  useBrowserForJS?: boolean
  showLogging?: boolean
  capturingThreshold?: number
  enableFileFeatures?: boolean
  perspective?: string
  enable3d?: boolean
  enableCAS?: boolean
  algebraInputPosition?: 'algebra' | 'top' | 'bottom'
  preventFocus?: boolean
  scaleContainerClass?: string
  autoHeight?: boolean
  allowUpscale?: boolean
  playButton?: boolean
  scale?: number
  showAnimationButton?: boolean
  showFullscreenButton?: boolean
  showSuggestionButtons?: boolean
  showStartTooltip?: boolean
  rounding?: string
  buttonShadows?: string
  buttonRounding?: number
}

// TODO: no idea what this is doing
interface GGBAppletViews {
  is3D: boolean
  AV: boolean
  SV: boolean
  CV: boolean
  EV2: boolean
  CP: boolean
  PC: boolean
  DA: boolean
  FI: boolean
  PV: boolean
  macro: boolean
}

function loadGeogebra(): Promise<void> {
  if (!promiseRef.current) {
    promiseRef.current = new Promise(resolve => {
      const script = document.createElement('script')
      script.src = 'https://cdn.geogebra.org/apps/deployggb.js'
      script.onload = () => {
        resolve()
      }

      document.body.appendChild(script)
    })
  }

  return promiseRef.current
}

// const ResponsiveIframe = styled.iframe({
//   width: '100%',
//   height: '100%'
// })

function createHtml(options: GGBAppletOptions) {
  return `
    <html>
    <head>
        <meta name=viewport content="width=device-width,initial-scale=1">  
        <meta charset="utf-8"/>
    </head>
    <body>
        <div>
            <div id="root"></div>
        </div>
        <script src="https://cdn.geogebra.org/apps/deployggb.js"></script>
        <script>
            var options = ${JSON.stringify(options).replace(/</g, '\\\u003c')};
            var app = new GGBApplet(options, true);
            window.addEventListener("load", function() { 
                app.inject('root');
            });
        </script>
    </body>
  </html>
  `
}

function GeoGebra(props: GeoGebraProps) {
  return (
    <ResponsiveIframe initialAspectRatio={4 / 3}>
      {setAspectRatio => {
        return <GeogebraIframe setAspectRatio={setAspectRatio} {...props} />
      }}
    </ResponsiveIframe>
  )

  // function setWidth(width: number) {
  //   if (!app.current) return
  //   console.log(app.current)
  //   app.current.setWidth(width)
  // }
}

function GeogebraIframe({
  setAspectRatio,
  ...props
}: GeoGebraProps & { setAspectRatio: (aspectRatio: number) => void }) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  React.useEffect(() => {
    window.addEventListener('message', handleMessage)

    function handleMessage(e) {
      console.log('msg', e)

      if (!iframeRef.current || !iframeRef.current.contentWindow) return
      iframeRef.current.contentWindow.postMessage(props, '*')
    }

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [props])

  return (
    <iframe
      style={{
        width: '100%',
        height: '100%',
        padding: 0,
        border: 'none'
      }}
      src="/geogebra.html"
      ref={iframeRef}
    />
  )
}

type GeoGebraProps = GeogebraAppletOptions

storiesOf('GeoGebra', module).add('Iframe', () => {
  return (
    <React.Fragment>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '600px',
          margin: '0 auto'
        }}
      >
        <GeoGebra
          options={{ material_id: 'H5ccx9NC', allowUpscale: true }}
          html5NoWebSimple
        />
      </div>
      {/*<GeoGebra*/}
      {/*    options={{ material_id: '12345', allowUpscale: true }}*/}
      {/*    html5NoWebSimple*/}
      {/*/>*/}
      {/*<GeoGebra*/}
      {/*    options={{ appName: 'geometry', height: 300 }}*/}
      {/*    html5NoWebSimple*/}
      {/*/>*/}
      {/*<GeoGebra*/}
      {/*    options={{ appName: '3d', height: 400, allowUpscale: true }}*/}
      {/*    html5NoWebSimple*/}
      {/*/>*/}
      {/*<GeoGebra*/}
      {/*    html5NoWebSimple*/}
      {/*    options={{ height: 400, allowUpscale: true }}*/}
      {/*/>*/}
    </React.Fragment>
  )
})
