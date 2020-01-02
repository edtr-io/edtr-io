import { PluginToolbarButton, useScopedSelector } from '@edtr-io/core'
import { Resizable } from '@edtr-io/editor-ui'
import {
  hasFocusedDescendant,
  isFocused,
  serializeDocument
} from '@edtr-io/store'
import { styled, faRandom, Icon } from '@edtr-io/ui'
import * as React from 'react'

import { MultimediaExplanationProps } from '.'

const STEPS = 4
const BREAKPOINT = 650

const StyledResizable = styled(Resizable)({
  padding: '5px',
  position: 'relative'
})

const Clear = styled.div({
  clear: 'both'
})

const Container = styled.div<{ hasFocus: boolean }>(props => {
  return {
    border: props.hasFocus ? '2px solid #ccc' : ''
  }
})

const InlineOptionsWrapper = styled.div({
  position: 'absolute',
  top: '-30px',
  right: '0',
  padding: '30px',
  zIndex: 95,
  whiteSpace: 'nowrap'
})

const InlineOptionsContentWrapper = styled.div({
  boxShadow: '0 2px 4px 0 rgba(0,0,0,0.50)',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '4px'
})

function InlineOptions(props: React.PropsWithChildren<{}>) {
  return (
    <InlineOptionsWrapper>
      <InlineOptionsContentWrapper>
        {props.children}
      </InlineOptionsContentWrapper>
    </InlineOptionsWrapper>
  )
}
const Option = styled.div({
  padding: '5px 10px',
  cursor: 'pointer',
  width: '100%',
  minWidth: '150px',
  '&:hover': {
    color: 'rgb(70, 155, 255)'
  }
})
export function MultimediaExplanationEditor(props: MultimediaExplanationProps) {
  function handleIllustratingChange(e: React.ChangeEvent<HTMLSelectElement>) {
    props.state.illustrating.set(e.target.value === 'illustrating')
  }
  const textFocused = useScopedSelector(
    hasFocusedDescendant(props.state.explanation.id)
  )

  const multimediaFocused = useScopedSelector(
    isFocused(props.state.multimedia.id)
  )

  const hasFocus = props.focused || multimediaFocused || textFocused

  const multimedia: {
    plugin: string
    state?: unknown
  } | null = useScopedSelector(serializeDocument(props.state.multimedia.id))
  const [replacedMultimediaCache, setReplacedMultimediaCache] = React.useState<
    Record<string, unknown>
  >({})
  function handleMultimediaChange(selected: string) {
    setReplacedMultimediaCache(current => {
      if (!multimedia) return current

      return {
        ...current,
        [multimedia.plugin]: multimedia.state
      }
    })
    props.state.multimedia.replace(selected, replacedMultimediaCache[selected])
  }
  const [showOptions, setShowOptions] = React.useState(false)

  const PluginSelection = (
    <select
      value={multimedia ? multimedia.plugin : ''}
      onChange={e => handleMultimediaChange(e.target.value)}
    >
      {props.config.plugins.map((plugin, i) => {
        return (
          <option key={i} value={plugin.name}>
            {plugin.title}
          </option>
        )
      })}
    </select>
  )

  const MultimediaSettings = (
    <React.Fragment>
      <hr />
      <div style={{ flex: 1 }}>
        <strong>Wie wichtig ist der Multimedia Inhalt?</strong>
      </div>
      <div style={{ flex: 1 }}>
        <select
          value={props.state.illustrating.value ? 'illustrating' : 'explaining'}
          onChange={handleIllustratingChange}
        >
          <option value="illustrating">
            Es ist nur eine Veranschaulichung
          </option>
          <option value="explaining">Es spielt eine zentrale Rolle</option>
        </select>
      </div>
      <div>
        <strong>Tausche das Multimedia Element:</strong>
        {PluginSelection}
      </div>
    </React.Fragment>
  )

  const [rowWidth, setRowWidth] = React.useState(0)

  const multimediaRendered = props.state.multimedia.render({
    renderToolbar(children) {
      return (
        <React.Fragment>
          <div
            style={{ position: 'relative' }}
            onMouseLeave={() => {
              setShowOptions(false)
            }}
          >
            <PluginToolbarButton
              icon={<Icon icon={faRandom} />}
              label="Tausche das Multimedia Element"
              onClick={() => {
                setShowOptions(true)
              }}
            />
            {showOptions ? (
              <InlineOptions>
                {props.config.plugins
                  .filter(
                    plugin => !multimedia || plugin.name !== multimedia.plugin
                  )
                  .map((plugin, i) => {
                    return (
                      <Option
                        key={i}
                        onClick={() => {
                          handleMultimediaChange(plugin.name)
                          setShowOptions(false)
                        }}
                      >
                        {plugin.title}
                      </Option>
                    )
                  })}
              </InlineOptions>
            ) : null}
          </div>
          {children}
        </React.Fragment>
      )
    },
    renderSettings(children) {
      return (
        <React.Fragment>
          {children}
          {MultimediaSettings}
        </React.Fragment>
      )
    }
  })

  return (
    <React.Fragment>
      <Container
        hasFocus={hasFocus}
        ref={el => {
          if (!el) return
          setRowWidth(el.offsetWidth)
        }}
      >
        {props.state.illustrating.value ? (
          <StyledResizable
            enabled={
              props.editable && hasFocus && props.state.illustrating.value
            }
            responsiveBreakpoint={BREAKPOINT}
            steps={STEPS}
            onResizeEnd={newWidth => {
              props.state.width.set(Math.round((newWidth * 100) / STEPS))
            }}
            rowWidth={rowWidth}
            widthInSteps={(props.state.width.value * STEPS) / 100}
            floating="right"
          >
            {multimediaRendered}
          </StyledResizable>
        ) : (
          multimediaRendered
        )}
        {props.state.explanation.render()}
        <Clear />
      </Container>
      {props.editable ? props.renderIntoSettings(MultimediaSettings) : null}
    </React.Fragment>
  )
}
