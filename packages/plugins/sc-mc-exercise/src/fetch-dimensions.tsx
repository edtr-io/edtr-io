import * as R from 'ramda'
import * as React from 'react'

/** @public */
export class FetchDimensions extends React.Component<
  FetchDimensionsProps,
  FetchDimensionsState
> {
  public state: FetchDimensionsState = {
    heights: R.times(() => null, this.props.length),
    widths: R.times(() => null, this.props.length),
    scrollHeights: R.times(() => null, this.props.length),
    scrollWidths: R.times(() => null, this.props.length),
    clientHeights: R.times(() => null, this.props.length),
    clientWidths: R.times(() => null, this.props.length),
  }

  public componentDidUpdate(): void {
    const all = R.all(
      (height) => typeof height === 'number',
      this.state.heights
    )

    if (all && !this.done) {
      this.done = true
      this.props.onDone(this.state as Dimensions)
    }
  }

  public render() {
    const createRef = (index: number) => (instance: HTMLElement | null) => {
      if (!instance) {
        return
      }

      this.setState((state) => {
        if (typeof state.heights[index] === 'number') {
          return null
        }

        return {
          heights: R.update(index, instance.offsetHeight, state.heights),
          widths: R.update(index, instance.offsetWidth, state.widths),
          scrollHeights: R.update(
            index,
            instance.scrollHeight,
            state.scrollHeights
          ),
          scrollWidths: R.update(
            index,
            instance.scrollWidth,
            state.scrollWidths
          ),
          clientHeights: R.update(
            index,
            instance.clientHeight,
            state.clientHeights
          ),
          clientWidths: R.update(
            index,
            instance.clientWidth,
            state.clientWidths
          ),
        }
      })
    }

    return this.props.render(createRef)
  }

  private done = false
}

/** @public */
export interface FetchDimensionsProps {
  length: number
  render: (
    createRef: (index: number) => (instance: HTMLElement | null) => void
  ) => React.ReactNode
  onDone: (dimensions: Dimensions) => void
}

/** @public */
export interface Dimensions {
  heights: number[]
  widths: number[]
  scrollHeights: number[]
  scrollWidths: number[]
  clientHeights: number[]
  clientWidths: number[]
}
/** @public */
export interface FetchDimensionsState {
  heights: (number | null)[]
  widths: (number | null)[]
  scrollHeights: (number | null)[]
  scrollWidths: (number | null)[]
  clientHeights: (number | null)[]
  clientWidths: (number | null)[]
}
