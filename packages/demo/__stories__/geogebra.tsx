import { storiesOf } from '@storybook/react'
import * as R from 'ramda'
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

function GeoGebra(props: GeoGebraProps) {
  const app = React.useRef<GGBApplet | null>(null)
  const appContainer = React.useRef<HTMLDivElement | null>(null)
  const [container, width] = useWidth<HTMLDivElement>()

  React.useLayoutEffect(() => {
    // if (!width) return

    // const params = R.mergeDeepRight(props, {
    //   options: {
    //     width,
    //     autoHeight: true
    //   }
    // } as GeoGebraProps)
    const params = props

    loadGeogebra().then(() => {
      if (!appContainer.current) return
      // console.log('initializing applet', params.options.width)
      app.current = createGeogebraApplet(params)
      console.log(app.current)
      app.current.inject(appContainer.current)
      // window.addEventListener("resize", () => {
      //   app.current.resize()
      // })
    })
  }, [props])

  return (
    <div ref={container}>
      <div ref={appContainer} />
    </div>
  )

  // function setWidth(width: number) {
  //   if (!app.current) return
  //   console.log(app.current)
  //   app.current.setWidth(width)
  // }
}

function useWidth<T extends HTMLElement>(): [
  React.MutableRefObject<T | null>,
  number | null
] {
  const container = React.useRef<T | null>(null)
  const previousWidth = React.useRef<number | null>(null)
  const [width, setWidth] = React.useState<number | null>(null)

  React.useEffect(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)

    return () => {
      window.removeEventListener('resize', updateWidth)
    }

    function updateWidth() {
      if (!container.current) return
      const newWidth = container.current.offsetWidth
      if (previousWidth.current !== newWidth) {
        setWidth(newWidth)
      }
    }
  }, [])

  return [container, width]
}

type GeoGebraProps = GeogebraAppletOptions

storiesOf('GeoGebra', module).add('Foo', () => {
  return (
    <React.Fragment>
      <div
        style={{
          position: 'relative',
          width: '400px',
          margin: '0 auto'
        }}
      >
        <GeoGebra
          options={{ material_id: 'H5ccx9NC', allowUpscale: true }}
          html5NoWebSimple
        />
      </div>
      <GeoGebra
        options={{ material_id: '12345', allowUpscale: true }}
        html5NoWebSimple
      />
      <GeoGebra
        options={{ appName: 'geometry', height: 300 }}
        html5NoWebSimple
      />
      <GeoGebra
        options={{ appName: '3d', height: 400, allowUpscale: true }}
        html5NoWebSimple
      />
      <GeoGebra
        html5NoWebSimple
        options={{ height: 400, allowUpscale: true }}
      />
    </React.Fragment>
  )
})
