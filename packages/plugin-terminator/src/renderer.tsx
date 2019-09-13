import { styled } from '@edtr-io/editor-ui'
import {
  StatefulPluginEditorProps,
  StateDescriptorReturnType
} from '@edtr-io/plugin'
import KaTeX from 'katex'
import * as React from 'react'

import { terminatorState } from '.'
import { TNode } from './terminator/05_TNode'
import { Create } from './terminator/30_Interface'

const BlockMathSpan = styled.span({
  display: 'block',
  margin: '1em 0',
  textAlign: 'center'
})

export function TerminatorRenderer(
  props: StatefulPluginEditorProps<typeof terminatorState> & {
    renderIntoExtendedSettings?: (children: React.ReactNode) => React.ReactNode
  }
) {
  const [term, setTerm] = React.useState<TNode | null>(null)
  const [index, setIndex] = React.useState(1)
  const [error, setError] = React.useState('')

  const stateRef = React.useRef(props.state)
  React.useEffect(() => {
    stateRef.current = props.state
  })

  React.useEffect(() => {
    console.log('render')
    let newTerm = null
    try {
      newTerm = Create(createInterfaceOptions(stateRef.current))
    } catch (e) {
      setError('Es gab einen Fehler: ' + e.message)
    }
    if (newTerm && error) setError('')
    if (newTerm) setTerm(newTerm)
  }, [index, stateRef, error])

  return (
    <>
      {props.renderIntoExtendedSettings
        ? props.renderIntoExtendedSettings(
            <TerminatorSettings
              state={props.state}
              inc={() => setIndex(index + 1)}
            />
          )
        : null}
      <p>&nbsp;</p>
      <p>
        {error ? (
          error
        ) : (
          <BlockMathSpan
            dangerouslySetInnerHTML={{
              __html: KaTeX.renderToString(
                '\\displaystyle ' +
                  (term ? term.toTeX() + ' = ' + term.value.toTeX() : 'xxx'),
                {
                  throwOnError: false
                }
              )
            }}
          ></BlockMathSpan>
        )}
      </p>
      <p>&nbsp;</p>
      <p>
        <button onClick={() => setIndex(index + 1)}>Neue Aufgabe</button>
        &nbsp;&nbsp;<small>TODO: Interaktive Eingabe der Lösung</small>
      </p>
    </>
  )
}

function createInterfaceOptions(
  state: StateDescriptorReturnType<typeof terminatorState>
) {
  if (state.catalog() == 'kopfexotic' && state.size() > 2) {
    throw new Error('Schnapszahlen unterstützt nur Termlänge 1')
  }
  if (state.catalog().includes('frac') && state.power() > 0) {
    throw new Error('Brüche unterstützen keine Potenzen')
  }
  if (
    state.addition() +
      state.multiplication() +
      state.subtraction() +
      state.division() +
      state.power() ==
    0
  ) {
    throw new Error('Bitte gib mindestens eine Rechenart an!')
  }
  if (state.size() < 0 || state.size() > 10) {
    throw new Error('Ungültige Termlänge')
  }

  return {
    catalog: state.catalog(),
    addition: state.addition(),
    multiplication: state.multiplication(),
    subtraction: state.subtraction(),
    division: state.division(),
    power: state.power(),
    size: state.size(),
    negative: state.negative(),
    decimals: state.decimals(),
    noMixed: state.noMixed()
  }
}

// ------------------------------------------------------------

interface TerminatorSettingsProps {
  state: StateDescriptorReturnType<typeof terminatorState>
  inc: () => void
}

function TerminatorSettings(props: TerminatorSettingsProps) {
  const {
    catalog,
    addition,
    multiplication,
    subtraction,
    division,
    power,
    size,
    negative,
    decimals,
    noMixed
  } = props.state
  return (
    <>
      <br />
      <label>
        Zahlenbereich:{' '}
        <select
          value={catalog()}
          onChange={e => {
            catalog.set(e.target.value)
            props.inc()
          }}
        >
          <option value="kopfeasy">
            natürliche Zahlen bis 100, kein Übertrag
          </option>
          <option value="kopfmedium">natürliche Zahlen bis 100</option>
          <option value="kopfexotic">Schnapszahlen</option>
          <option value="large">große natürliche Zahlen</option>
          <option value="fraceasy">einfache Brüche</option>
          <option value="fracbasic">normale Brüche</option>
        </select>
      </label>
      <hr />
      <label>
        Termgröße:{' '}
        <input
          type="number"
          min="1"
          max="10"
          value={size()}
          size={5}
          onChange={e => {
            size.set(parseInt(e.target.value))
            props.inc()
          }}
        />
      </label>{' '}
      <label>
        Negative Zahlen:{' '}
        <select
          value={negative()}
          onChange={e => {
            negative.set(parseInt(e.target.value))
            props.inc()
          }}
        >
          <option value="0">keine</option>
          <option value="1">wenig</option>
          <option value="2">mittel</option>
          <option value="3">viel</option>
        </select>
      </label>
      <hr />
      <label>
        Addition:{' '}
        <select
          value={addition()}
          onChange={e => {
            addition.set(parseInt(e.target.value))
            props.inc()
          }}
        >
          <option value="0">---</option>
          <option value="1">normal</option>
          <option value="2">viel</option>
          <option value="3">sehr viel</option>
        </select>
      </label>
      {'  '}
      <label>
        Multiplikation:{' '}
        <select
          value={multiplication()}
          onChange={e => {
            multiplication.set(parseInt(e.target.value))
            props.inc()
          }}
        >
          <option value="0">---</option>
          <option value="1">normal</option>
          <option value="2">viel</option>
          <option value="3">sehr viel</option>
        </select>
      </label>
      <br />
      <label>
        Subtraktion:{' '}
        <select
          value={subtraction()}
          onChange={e => {
            subtraction.set(parseInt(e.target.value))
            props.inc()
          }}
        >
          <option value="0">---</option>
          <option value="1">normal</option>
          <option value="2">viel</option>
          <option value="3">sehr viel</option>
        </select>
      </label>
      {'  '}
      <label>
        Division:{' '}
        <select
          value={division()}
          onChange={e => {
            division.set(parseInt(e.target.value))
            props.inc()
          }}
        >
          <option value="0">---</option>
          <option value="1">normal</option>
          <option value="2">viel</option>
          <option value="3">sehr viel</option>
        </select>
      </label>
      {'  '}
      <label>
        Potenz:{' '}
        <select
          value={power()}
          onChange={e => {
            power.set(parseInt(e.target.value))
            props.inc()
          }}
        >
          <option value="0">---</option>
          <option value="1">normal</option>
          <option value="2">viel</option>
          <option value="3">sehr viel</option>
        </select>
      </label>
      <hr />
      <label>
        <input
          type="checkbox"
          value="dec"
          defaultChecked={decimals()}
          onChange={e => {
            decimals.set(e.target.checked)
            props.inc()
          }}
        />{' '}
        Erlaube Dezimalzahlen
      </label>{' '}
      <label>
        <input
          type="checkbox"
          value="no_mixed"
          defaultChecked={noMixed()}
          onChange={e => {
            noMixed.set(e.target.checked)
            props.inc()
          }}
        />{' '}
        Keine gemischten Brüche
      </label>
      <hr />
      <label>
        Voreinstellungen:{' '}
        <select
          value="none"
          onChange={e => {
            doPreset(e.target.value, props.state)
            props.inc()
          }}
        >
          <option value="none">---</option>
          <option value="p1">Kopfrechnen</option>
          <option value="p2">Terme mit natürlichen Zahlen</option>
          <option value="p3">Negative Zahlen</option>
          <option value="p4">Einstieg Bruchrechnung</option>
          <option value="p5">Dezimalzahlen</option>
          <option value="p0">(leer)</option>
        </select>
      </label>
    </>
  )
}

function doPreset(
  key: string,
  state: StateDescriptorReturnType<typeof terminatorState>
) {
  if (key === 'p0') {
    state.catalog.set('kopfeasy')
    state.addition.set(1)
    state.multiplication.set(0)
    state.subtraction.set(0)
    state.division.set(0)
    state.power.set(0)
    state.size.set(1)
    state.negative.set(0)
    state.decimals.set(false)
    state.noMixed.set(false)
  }
  if (key === 'p1') {
    state.catalog.set('kopfmedium')
    state.addition.set(1)
    state.multiplication.set(1)
    state.subtraction.set(1)
    state.division.set(2)
    state.power.set(3)
    state.size.set(1)
    state.negative.set(0)
    state.decimals.set(false)
    state.noMixed.set(false)
  }
  if (key === 'p2') {
    state.catalog.set('kopfeasy')
    state.addition.set(1)
    state.multiplication.set(1)
    state.subtraction.set(1)
    state.division.set(2)
    state.power.set(2)
    state.size.set(4)
    state.negative.set(0)
    state.decimals.set(false)
    state.noMixed.set(false)
  }
  if (key === 'p3') {
    state.catalog.set('kopfmedium')
    state.addition.set(1)
    state.multiplication.set(0)
    state.subtraction.set(1)
    state.division.set(0)
    state.power.set(0)
    state.size.set(1)
    state.negative.set(3)
    state.decimals.set(false)
    state.noMixed.set(false)
  }
  if (key === 'p4') {
    state.catalog.set('fraceasy')
    state.addition.set(1)
    state.multiplication.set(0)
    state.subtraction.set(0)
    state.division.set(0)
    state.power.set(0)
    state.size.set(1)
    state.negative.set(0)
    state.decimals.set(false)
    state.noMixed.set(false)
  }
  if (key === 'p5') {
    state.catalog.set('fracbasic')
    state.addition.set(0)
    state.multiplication.set(1)
    state.subtraction.set(0)
    state.division.set(1)
    state.power.set(0)
    state.size.set(1)
    state.negative.set(3)
    state.decimals.set(true)
    state.noMixed.set(true)
  }
}
