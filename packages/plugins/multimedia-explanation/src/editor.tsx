import { PluginToolbarButton, useScopedSelector } from '@edtr-io/core'
import {
  hasFocusedDescendant,
  isEmpty,
  isFocused,
  serializeDocument,
} from '@edtr-io/store'
import { styled, faRandom, Icon, faTrashAlt } from '@edtr-io/ui'
import * as React from 'react'

import { MultimediaExplanationProps } from '.'
import { useMultimediaExplanationConfig } from './config'
import { Resizable } from './resizable'

const STEPS = 4
const BREAKPOINT = 650

const StyledResizable = styled(Resizable)({
  padding: '5px',
  position: 'relative',
})

const Clear = styled.div({
  clear: 'both',
})

const Container = styled.div<{ hasFocus: boolean }>((props) => {
  return {
    border: props.hasFocus ? '2px solid #ccc' : '',
  }
})

const InlineOptionsWrapper = styled.div({
  position: 'absolute',
  top: '-30px',
  right: '0',
  padding: '30px',
  zIndex: 95,
  whiteSpace: 'nowrap',
})

const InlineOptionsContentWrapper = styled.div({
  boxShadow: '0 2px 4px 0 rgba(0,0,0,0.50)',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '4px',
})

function InlineOptions({ children }: { children: React.ReactNode }) {
  return (
    <InlineOptionsWrapper>
      <InlineOptionsContentWrapper>{children}</InlineOptionsContentWrapper>
    </InlineOptionsWrapper>
  )
}
const Option = styled.div({
  padding: '5px 10px',
  cursor: 'pointer',
  width: '100%',
  minWidth: '150px',
  '&:hover': {
    color: 'rgb(70, 155, 255)',
  },
})
export function MultimediaExplanationEditor(props: MultimediaExplanationProps) {
  const config = useMultimediaExplanationConfig(props.config)

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
  const withoutMultimedia = useScopedSelector(
    isEmpty(props.state.multimedia.id)
  )

  const multimedia: {
    plugin: string
    state?: unknown
  } | null = useScopedSelector(serializeDocument(props.state.multimedia.id))
  const [replacedMultimediaCache, setReplacedMultimediaCache] = React.useState<
    Record<string, unknown>
  >({})
  function handleMultimediaChange(selected: string) {
    setReplacedMultimediaCache((current) => {
      if (!multimedia) return current

      return {
        ...current,
        [multimedia.plugin]: multimedia.state,
      }
    })
    props.state.multimedia.replace(selected, replacedMultimediaCache[selected])
  }
  const [showOptions, setShowOptions] = React.useState(false)

  const pluginSelection = (
    <select
      value={multimedia ? multimedia.plugin : ''}
      onChange={(e) => handleMultimediaChange(e.target.value)}
    >
      {props.config.plugins.map((plugin) => {
        return (
          <option key={plugin.name} value={plugin.name}>
            {plugin.title}
          </option>
        )
      })}
    </select>
  )

  const multimediaSettings = (
    <>
      <hr />
      {config.features.importance ? (
        <>
          <div style={{ flex: 1 }}>
            <strong>{config.i18n.illustrating.label}</strong>
          </div>
          <div style={{ flex: 1 }}>
            <select
              value={
                props.state.illustrating.value ? 'illustrating' : 'explaining'
              }
              onChange={handleIllustratingChange}
            >
              <option value="illustrating">
                {config.i18n.illustrating.values.illustrating}
              </option>
              <option value="explaining">
                {config.i18n.illustrating.values.explaining}
              </option>
            </select>
          </div>
        </>
      ) : null}
      {props.config.plugins.length > 1 ? (
        <div>
          <strong>{config.i18n.changeMultimediaType}</strong>
          {pluginSelection}
        </div>
      ) : null}
    </>
  )

  const [rowWidth, setRowWidth] = React.useState(0)

  const multimediaRendered = props.state.multimedia.render({
    renderToolbar(children) {
      return (
        <>
          <div
            style={{ position: 'relative' }}
            onMouseLeave={() => {
              setShowOptions(false)
            }}
          >
            {props.config.plugins.length > 1 ? (
              <PluginToolbarButton
                icon={<Icon icon={faRandom} />}
                label={config.i18n.changeMultimediaType}
                onClick={() => {
                  setShowOptions(true)
                }}
              />
            ) : null}
            <PluginToolbarButton
              icon={<Icon icon={faTrashAlt} />}
              label={config.i18n.reset}
              onClick={() => {
                props.state.multimedia.replace(
                  multimedia?.plugin ?? props.config.plugins[0].name
                )
              }}
            />
            {showOptions ? (
              <InlineOptions>
                {props.config.plugins
                  .filter(
                    (plugin) => !multimedia || plugin.name !== multimedia.plugin
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
        </>
      )
    },
    renderSettings(children) {
      return (
        <>
          {children}
          {multimediaSettings}
        </>
      )
    },
  })

  if (!props.editable && withoutMultimedia) {
    return props.state.explanation.render()
  }

  return (
    <>
      <Container
        hasFocus={hasFocus}
        ref={(el) => {
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
            onResizeEnd={(newWidth) => {
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
      {props.editable ? props.renderIntoSettings(multimediaSettings) : null}
    </>
  )
}
