import { Document, EditorProvider } from '@edtr-io/core'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { DragDropContextProvider } from 'react-dnd'
import html5Backend from 'react-dnd-html5-backend'

import { plugins } from '../src/plugins'
import { EditorStory } from '../src'

const state = JSON.parse(
  '{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Ein Kreis beschreibt die Menge aller Punkte, die denselben Abstand ","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"r","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":" zum Mittelpunkt ","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"M","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":" besitzen. In diesem Artikel lernst du die folgenden Formeln kennen:\\r","marks":[]}]}]}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"unordered-list","data":{},"nodes":[{"object":"block","type":"list-item","data":{},"nodes":[{"object":"block","type":"list-item-child","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]},{"object":"inline","type":"@splish-me/a","data":{"href":"#umfang"},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Berechnung des Umfangs\\r","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]}]},{"object":"block","type":"list-item","data":{},"nodes":[{"object":"block","type":"list-item-child","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]},{"object":"inline","type":"@splish-me/a","data":{"href":"#bogen"},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Berechnung der Kreisbogenlänge","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":"\\r","marks":[]}]}]}]}]}]}}},{"plugin":"image","state":{"src":"https://assets.serlo.org/legacy/58ef269467e34_35c96883eb85496db4814393e6c1babd5e3987c1.png","href":"","target":"","rel":"","description":"Veranschaulichung Mittelpunkt und Radius des Kreises","maxWidth":400}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"@splish-me/h2","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Zusammenfassung","marks":[]}]}]}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"unordered-list","data":{},"nodes":[{"object":"block","type":"list-item","data":{},"nodes":[{"object":"block","type":"list-item-child","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Umfang","marks":[{"object":"mark","type":"@splish-me/strong","data":{}}]},{"object":"leaf","text":": ","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"U=2\\\\pi r","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":"","marks":[{"object":"mark","type":"@splish-me/strong","data":{}}]}]}]}]},{"object":"block","type":"list-item","data":{},"nodes":[{"object":"block","type":"list-item-child","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Kreisbogenlänge:","marks":[{"object":"mark","type":"@splish-me/strong","data":{}}]},{"object":"leaf","text":" ","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"b=U\\\\cdot\\\\frac{\\\\alpha}{360^{\\\\circ}}","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]}]}]}]}}},{"plugin":"anchor","state":"umfang"},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"@splish-me/h2","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Bestimmung des Umfangs","marks":[]}]}]}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Den ","marks":[]}]},{"object":"inline","type":"@splish-me/a","data":{"href":"https://de.serlo.org/36162"},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Umfang","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":" erhältst du durch Abrollen des ","marks":[]}]},{"object":"inline","type":"@splish-me/a","data":{"href":"https://de.serlo.org/36162"},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Kreises","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":" und messen der abgerollten ","marks":[]}]},{"object":"inline","type":"@splish-me/a","data":{"href":"https://de.serlo.org/1953"},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Strecke","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":". Auf diese Weise kannst du die ","marks":[]}]},{"object":"inline","type":"@splish-me/a","data":{"href":"https://de.serlo.org/2107"},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Kreiszahl","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":" ","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"\\\\pi","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":" definieren.\\r","marks":[]}]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"\\r","marks":[]}]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"In der Abbildung rechts siehst du, wie ein Kreis mit ","marks":[]}]},{"object":"inline","type":"@splish-me/a","data":{"href":"https://de.serlo.org/36162"},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Durchmesser","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":" ","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"d=1","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":" abgerollt wird.\\r","marks":[]}]}]}]}}},{"plugin":"image","state":{"src":"https://assets.serlo.org/legacy/58eb97b7e5376_7d4211710d8bab642798e39e07788e6f2912e86a.gif","href":"","target":"","rel":"","description":"Kreis abrollen","maxWidth":0}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Sein Umfang beträgt ","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"\\\\pi","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":", also etwa ","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"3,14","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":".    \\r","marks":[]}]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Für den Umfang findest du so den folgenden Zusammenhang: \\r","marks":[]}]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"U=2\\\\cdot r\\\\cdot\\\\pi=d\\\\cdot\\\\pi","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":"\\r","marks":[]}]}]}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"@splish-me/h3","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Applett (nicht ganz zum Thema)","marks":[]}]}]}]}}},{"plugin":"geogebra","state":"https://www.geogebra.org/m/JkhUAAYY"},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Hier siehst du, wie du einen ","marks":[]},{"object":"leaf","text":"Umkreis ","marks":[{"object":"mark","type":"@splish-me/strong","data":{}}]},{"object":"leaf","text":"konstruierst. ","marks":[]}]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Hat zwar nichts mit dem Thema zu tun, aber trotzdem schön!","marks":[]}]}]}]}}},{"plugin":"spoiler","state":{"title":"Übung","content":{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Ein Kreis hat den Radius ","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"r=\\\\ 3\\\\ cm","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":". Berechne seinen Umfang. Runde auf eine ganze Zahl. Verwende ","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"\\\\pi=3,14","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":"!","marks":[]}]}]}]}}},{"plugin":"inputExercise","state":{"type":"Text","correctAnswers":["19"],"wrongAnswers":[{"value":"18","feedback":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Hast du für ","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"\\\\pi=\\\\ 3,14\\\\ ","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":"verwendet?","marks":[]}]}]}]}}}}]}},{"plugin":"solution","state":{"title":"","content":{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Benutze die Formel ","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"U=2r\\\\pi","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":" und setze ","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"r=3\\\\ cm","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":" ein.","marks":[]}]}]}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"U=2\\\\cdot\\\\ \\\\left(3\\\\ cm\\\\right)\\\\cdot\\\\pi\\\\ \\\\approx2\\\\cdot\\\\left(3\\\\ cm\\\\right)\\\\cdot3,14\\\\ \\\\text{ }\\\\approx18,84\\\\ cm\\\\ \\\\approx\\\\ 19\\\\ cm\\\\ ","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]}]}}}]}}}]}}},{"plugin":"anchor","state":"bogen"},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"@splish-me/h2","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Berechnung der Kreisbogenlänge","marks":[]}]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":" Die ","marks":[]}]},{"object":"inline","type":"@splish-me/a","data":{"href":"https://de.serlo.org/36162"},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Kreisbogenlänge","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":" ","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"b","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":" kannst du über den vom Kreissektor eingeschlossenen ","marks":[]}]},{"object":"inline","type":"@splish-me/a","data":{"href":"https://de.serlo.org/1707"},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Winkel","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":" ","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"\\\\alpha","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":" und den ","marks":[]}]},{"object":"inline","type":"@splish-me/a","data":{"href":"https://de.serlo.org/1557"},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Radius","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":" ","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"r","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":" bestimmen.  \\r","marks":[]}]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"\\r","marks":[]}]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Der Kreis hat einen Innenwinkel von ","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"360^{\\\\circ}","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":".","marks":[]}]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Das Verhältnis des Winkels ","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"\\\\alpha","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":" zu ","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"360\\\\degree","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":" , gibt dir den Anteil der Kreisbogenlänge ","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"b","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":" vom Umfang ","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"U\\\\ ","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":"an.\\r","marks":[]}]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Du erhältst so die Formel:  \\r","marks":[]}]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"\\r","marks":[]}]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"b=\\\\frac{\\\\alpha}{360^{\\\\circ}}\\\\cdot U=\\\\frac{\\\\alpha}{360^{\\\\circ}}\\\\cdot2\\\\pi r","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]}]}}},{"plugin":"image","state":{"src":"https://assets.serlo.org/legacy/58ecbe6a58ce5_08c8e0a67329de398b57f2611d115762e72ecd08.png","href":"","target":"","rel":"","description":"Bogenlänge eines Kreises","maxWidth":300}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"@splish-me/h2","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Video zum Thema","marks":[]}]}]}]}}},{"plugin":"video","state":"https://youtu.be/B8eVrg1ki5g"}]}'
)

storiesOf('Article', module)
  .add('Initial State', () => {
    return <EditorStory defaultPlugin="text" initialState={state} />
  })
  .add('Initial State (w/ outer DragDropContext)', () => {
    return (
      <DragDropContextProvider backend={html5Backend}>
        <EditorStory
          defaultPlugin="text"
          initialState={state}
          omitDragDropContext
        />
      </DragDropContextProvider>
    )
  })
  .add('Initial State (w/ change listener)', () => {
    return (
      <EditorStory
        defaultPlugin="text"
        initialState={state}
        onChange={action('changed')}
      />
    )
  })
  .add('Multiple Editors', () => {
    const state2 = {
      plugin: 'rows',
      state: [
        {
          plugin: 'text',
          state: JSON.parse(
            '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"@splish-me/h2","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Zweiter Editor","marks":[]}]}]}]}}'
          )
        }
      ]
    }
    return (
      <EditorProvider>
        <div
          style={{
            position: 'fixed',
            width: '20vw',
            right: '0',
            top: '0',
            overflow: 'hidden',
            height: '100vh',
            borderLeft: '4px solid black',
            backgroundColor: '#eee',
            zIndex: 999
          }}
        >
          Here is a small preview of the rendered Document
          <div>
            <div
              style={{
                width: '850px',
                transformOrigin: 'left top 0px',
                transform: 'scale(0.22)',
                overflow: 'hidden'
              }}
            >
              <Document
                initialState={state}
                plugins={plugins}
                defaultPlugin="text"
                scope="instance1"
                mirror
              />
            </div>
          </div>
        </div>
        <Document
          initialState={state}
          plugins={plugins}
          defaultPlugin="text"
          scope="instance1"
          editable
        />
        <p>And here is a second instance</p>
        <Document
          initialState={state2}
          plugins={plugins}
          defaultPlugin="text"
          scope="instance2"
          editable
        />
        <p>And here is the rendered output of Instance 1:</p>
        <Document
          plugins={plugins}
          defaultPlugin="text"
          scope="instance1"
          mirror
        />
      </EditorProvider>
    )
  })
