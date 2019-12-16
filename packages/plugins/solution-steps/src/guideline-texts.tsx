import * as React from 'react'

export const addStepLabel =
  'Ein Bestandteil der Lösung, der zur Lösung der Aufgabe aufgeschrieben werden muss'
export const addExplanationLabel =
  'Eine zusätzliche Erklärung, die den Lernenden beim Verstehen der Lösung helfen soll'
export const addStrategyLabel = 'Erkläre dein Vorgehen'

export const introductionHelptext: React.ReactNode = (
  <div>
    <h1>Wichtiges Wissen zur Aufgabe</h1>
    <ul>
      <li>
        Formuliere einen einführenden Satz, in dem das Thema bzw. die wichtigste
        Methode genannt wird
      </li>
      <li>Verlinke auf einen Artikel zum Thema bzw. zur wichtigsten Methode</li>
    </ul>
  </div>
)

export const strategyHelptext: React.ReactNode = (
  <div>
    <h1>Lösungsstrategie</h1>
    <p>
      Bei schwierigen oder mehrschrittigen Aufgaben empfiehlt es sich eine
      Lösungsstrategie zu beschreiben. Wir empfehlen folgendene Elemente:
    </p>
    <ul>
      <li>
        <b>Zielanaylse</b>
        <p>Frage dich selbst: Was ist der Zielzustand der Aufgabe?</p>
      </li>
      <li>
        <b>Situationsanalyse</b>
        <p>
          Frage dich selbst: Was ist die Ausgangssituation der Aufgabe und
          welche Angaben habe ich vorliegen?
        </p>
      </li>
      <li>
        <b>Planerstellung</b>
        <p>
          Frage dich selbst: Wie bereite ich mich auf die Aufgabe vor, wie fange
          ich an und was ist die zeitliche Abfolge der Lösungsschritte?
        </p>
      </li>
    </ul>
  </div>
)

export const solutionStepHelptext = <div>Hi</div>

export const explanationHelptext = <div> Hi </div>
