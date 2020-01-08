import { styled } from '@edtr-io/editor-ui'
import { StateTypeReturnType } from '@edtr-io/plugin'
import katex from 'katex'
import * as R from 'ramda'
import * as React from 'react'

import { EquationsProps, EquationsState } from '.'

enum Phase {
  noJS = 0,
  hiddenRender = 1,
  maxWidthLeft = 2,
  maxWidthRight = 3,
  maxWidthTotal = 4,
  newLine = 5
}

export const LayoutContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'flex-start'
})

export const LeftSide = styled.div({
  width: '33%',
  //textAlign: 'right',
  '@media(max-width: 480px)': { width: '100%', textAlign: 'left' },
  '@media(max-width: 768px)': { width: '50%', textAlign: 'right' },
  '@media(min-width:768px)': { textAlign: 'right' }
})

export const RightSide = styled.div({
  width: '33%',
  display: 'flex',
  flexDirection: 'row',
  '@media(max-width: 480px)': { width: '100%' },
  '@media(max-width: 768px)': { width: '50%' }
})
export const Transformation = styled.div({
  width: '33%',
  '@media(max-width: 768px)': { width: '100%', textAlign: 'center' }
})

export class EquationsRenderer extends React.Component<
  EquationsProps,
  EquationsRendererState
> {
  public state: EquationsRendererState = {
    phase: Phase.noJS,
    widthLeftSingle: [],
    widthLeftDouble: [],
    widthRightSingle: [],
    widthRightDouble: [],
    widthTrans: [],
    containerWidth: undefined
  }

  public render() {
    const { state } = this.props
    const rows = state.steps
    return (
      <React.Fragment>
        {/* {this.state.phase === Phase.noJS ? ( */}
        <div>
          {rows.map(row => {
            return (
              <LayoutContainer key={row.left.id}>
                <LeftSide>{row.left.render()}</LeftSide>
                <RightSide>
                  {this.showSymbol(row.symbol.value)}
                  {row.right.render()}
                </RightSide>
                {row.transform === undefined ? null : (
                  <Transformation>{row.transform.render()}</Transformation>
                )}
              </LayoutContainer>
            )
          })}
        </div>
        {/* ) : null} */}
        {/* {this.renderHidden()} */}
      </React.Fragment>
    )
  }

  public componentDidMount() {
    setTimeout(() => this.calculateLayout())
    window.addEventListener('resize', this.calculateLayout)
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.calculateLayout)
  }
  public showSymbol(symbol: string) {
    console.log('symbol:', symbol)
    switch (symbol) {
      case 'equals':
        console.log('equals:', symbol)
        return (
          <span
            dangerouslySetInnerHTML={{
              __html: katex.renderToString('=')
            }}
          />
        )
      case 'approx':
        return (
          <span
            dangerouslySetInnerHTML={{
              __html: katex.renderToString('\\approx')
            }}
          />
        )
      case 'greater':
        return (
          <span
            dangerouslySetInnerHTML={{ __html: katex.renderToString('>') }}
          />
        )
      case 'lesser':
        return (
          <span
            dangerouslySetInnerHTML={{ __html: katex.renderToString('<') }}
          />
        )
      case 'greater-equal':
        return (
          <span
            dangerouslySetInnerHTML={{ __html: katex.renderToString('\\geq') }}
          />
        )
      case 'lesser-equal':
        return (
          <span
            dangerouslySetInnerHTML={{ __html: katex.renderToString('\\leq') }}
          />
        )
    }
  }
  private renderHidden = () => {
    interface StepFit {
      step: StateTypeReturnType<EquationsState>['steps'][0]
      fits: boolean
    }
    const { state } = this.props
    let rows: StepFit[] = []
    rows = state.steps.map((step, index) => {
      const fit =
        this.state.phase < Phase.maxWidthTotal ||
        R.max(
          // eslint-disable-next-line @typescript-eslint/unbound-method
          R.reduce(R.max, 0, this.state.widthLeftSingle.filter(Boolean)),
          this.state.widthLeftDouble[index] || 0
        ) <= 20 ||
        R.max(
          // eslint-disable-next-line @typescript-eslint/unbound-method
          R.reduce<number, number>(
            R.max,
            0,
            this.state.widthLeftSingle.filter(Boolean) as number[]
          ),
          this.state.widthLeftDouble[index] || 0
        ) +
          R.max(
            R.reduce<number, number>(
              // eslint-disable-next-line @typescript-eslint/unbound-method
              R.max,
              0,
              this.state.widthRightSingle.filter(Boolean) as number[]
            ),
            this.state.widthRightDouble[index] || 0
          ) +
          (this.state.widthTrans[index] || 0) <
          (this.state.containerWidth || 0)
      if (this.state.phase < Phase.newLine) {
        if (!fit && this.state.widthLeftDouble[index] === undefined) {
          this.setState(state => {
            return {
              widthLeftDouble: R.update(
                index,
                state.widthLeftSingle[index],
                state.widthLeftDouble
              ),
              widthLeftSingle: R.update(
                index,
                undefined,
                state.widthLeftSingle
              ),
              widthRightDouble: R.update(
                index,
                state.widthRightSingle[index],
                state.widthRightDouble
              ),
              widthRightSingle: R.update(
                index,
                undefined,
                state.widthRightSingle
              )
            }
          })
        } else if (
          fit &&
          this.state.widthLeftSingle[index] === undefined &&
          this.state.phase >= Phase.maxWidthTotal
        ) {
          this.setState(state => {
            return {
              widthLeftSingle: R.update(
                index,
                state.widthLeftDouble[index],
                state.widthLeftSingle
              ),
              widthLeftDouble: R.update(
                index,
                undefined,
                state.widthLeftDouble
              ),
              widthRightSingle: R.update(
                index,
                state.widthRightDouble[index],
                state.widthRightSingle
              ),
              widthRightDouble: R.update(
                index,
                undefined,
                state.widthRightDouble
              )
            }
          })
        }
      }
      return {
        step: step,
        fits: fit
      }
    })

    if (this.state.phase < Phase.hiddenRender) {
      return null
    }
    return (
      <div
        ref={ref => {
          if (!ref) {
            return
          }
        }}
      >
        {rows.map((row, index) => {
          return (
            <div
              key={index}
              // 2 Listen zur Ausrichtung
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection:
                  this.state.phase > Phase.hiddenRender && !row.fits
                    ? 'column'
                    : undefined,
                visibility:
                  this.state.phase < Phase.maxWidthTotal ? 'hidden' : undefined
              }}
              ref={ref => {
                if (!ref) {
                  return
                }
                if (this.state.phase === Phase.hiddenRender) {
                  this.setState({
                    containerWidth: ref.offsetWidth
                  })
                }
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  paddingRight: '5px',
                  textAlign: row.fits ? 'right' : undefined,
                  width:
                    this.state.phase < Phase.maxWidthLeft || !row.fits
                      ? 'auto'
                      : Math.ceil(
                          R.reduce<number, number>(
                            // eslint-disable-next-line @typescript-eslint/unbound-method
                            R.max,
                            0,
                            this.state.widthLeftSingle.filter(
                              Boolean
                            ) as number[]
                          )
                        ) + 1
                }}
                ref={ref => {
                  if (!ref) {
                    return
                  }
                  if (
                    this.state.phase < Phase.maxWidthLeft &&
                    this.state.widthLeftSingle[index] === undefined
                  ) {
                    this.setState(
                      state => {
                        return {
                          widthLeftSingle: R.update(
                            index,
                            ref.offsetWidth,
                            state.widthLeftSingle
                          )
                        }
                      },
                      () => {
                        const all = R.all(width => {
                          return width !== undefined
                        }, this.state.widthLeftSingle)
                        if (all) {
                          this.setState(state => {
                            if (state.phase < Phase.maxWidthLeft) {
                              return { phase: Phase.maxWidthLeft }
                            }
                            return null
                          })
                        }
                      }
                    )
                  }
                }}
              >
                {row.step.left.render()}
              </div>

              <div
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'flex-start',
                  paddingLeft: row.fits ? undefined : '20px'
                }}
              >
                <div
                  style={{
                    paddingRight:
                      row.step.transform === undefined ? undefined : '10px',
                    width:
                      this.state.phase < Phase.maxWidthRight
                        ? 'auto'
                        : Math.ceil(
                            row.fits
                              ? R.reduce<number, number>(
                                  // eslint-disable-next-line @typescript-eslint/unbound-method
                                  R.max,
                                  0,
                                  this.state.widthRightSingle.filter(
                                    Boolean
                                  ) as number[]
                                )
                              : this.state.widthRightDouble[index] || 0
                          ) + 1
                  }}
                  ref={ref => {
                    if (!ref) {
                      return
                    }
                    if (
                      this.state.phase < Phase.maxWidthRight &&
                      this.state.widthRightSingle[index] === undefined
                    ) {
                      this.setState(
                        state => {
                          return {
                            widthRightSingle: R.update(
                              index,
                              ref.offsetWidth,
                              state.widthRightSingle
                            )
                          }
                        },
                        () => {
                          const all = R.all(width => {
                            return width !== undefined
                          }, this.state.widthRightSingle)
                          if (all) {
                            this.setState(state => {
                              if (state.phase < Phase.maxWidthRight) {
                                return { phase: Phase.maxWidthRight }
                              }
                              return null
                            })
                          }
                        }
                      )
                    }
                  }}
                >
                  {row.step.right.render()}
                </div>
                {row.step.transform === undefined ? (
                  this.state.widthTrans[index] === undefined ? (
                    this.setState(state => {
                      return {
                        widthTrans: R.update(index, 0, state.widthTrans)
                      }
                    })
                  ) : null
                ) : (
                  <div
                    ref={ref => {
                      if (!ref) {
                        return
                      }
                      if (
                        this.state.phase < Phase.maxWidthTotal &&
                        this.state.widthTrans[index] === undefined
                      ) {
                        this.setState(
                          state => {
                            return {
                              widthTrans: R.update(
                                index,
                                ref.offsetWidth,
                                state.widthTrans
                              )
                            }
                          },
                          () => {
                            const all = R.all(width => {
                              return width !== undefined
                            }, this.state.widthTrans)
                            if (all) {
                              this.setState(state => {
                                if (state.phase < Phase.maxWidthTotal) {
                                  return { phase: Phase.maxWidthTotal }
                                }
                                return null
                              })
                            }
                          }
                        )
                      }
                    }}
                  >
                    {row.step.transform.render()}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  private calculateLayout = () => {
    const rows = this.props.state.steps
    this.setState({
      phase: Phase.hiddenRender,
      widthLeftSingle: rows.map(() => {
        return undefined
      }),
      widthLeftDouble: rows.map(() => {
        return undefined
      }),
      widthRightSingle: rows.map(() => {
        return undefined
      }),
      widthRightDouble: rows.map(() => {
        return undefined
      }),
      widthTrans: rows.map(() => {
        return undefined
      }),
      containerWidth: undefined
    })
  }
}

export interface EquationsRendererState {
  phase: Phase
  widthLeftSingle: (number | undefined)[]
  widthLeftDouble: (number | undefined)[]
  widthRightSingle: (number | undefined)[]
  widthRightDouble: (number | undefined)[]
  widthTrans: (number | undefined)[]
  containerWidth: number | undefined
}
