import { faLevelUpAlt, Icon } from '@edtr-io/ui'
import * as React from 'react'

import {
  BackgroundSymbol,
  getIcon,
  SolutionPluginTypes
} from './styled-elements'

export const stepLabel =
  'Ein Bestandteil der Lösung, der zur Lösung der Aufgabe aufgeschrieben werden muss'
export const explanationLabel =
  'Eine zusätzliche Erklärung, die den Lernenden beim Verstehen der Lösung helfen soll'
export const strategyLabel = 'Erkläre dein Vorgehen'
export const additionalsLabel = 'Ergänze weitere Inhalte zur Lösung'
export const introductionLabel =
  'Ein einführender Satz, in dem das Thema bzw die wichtigste Methode genannt wird'
//TODO: refactor Backgroundsymbol -> hand down via config?
export const introductionGuideline: React.ReactNode = (
  <div>
    <h1>Wichtiges Wissen zur Aufgabe</h1>
    <ul>
      <li>
        Formuliere einen einführenden Satz, in dem das Thema bzw. die wichtigste
        Methode genannt wird
      </li>
      <li>Verlinke auf einen Artikel zum Thema bzw. zur wichtigsten Methode</li>
    </ul>
    <BackgroundSymbol>
      {getIcon(SolutionPluginTypes.introduction, '8x')}
    </BackgroundSymbol>
  </div>
)

export const strategyGuideline: React.ReactNode = (
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
    <BackgroundSymbol>
      {getIcon(SolutionPluginTypes.strategy, '8x')}
    </BackgroundSymbol>
  </div>
)

export const stepGuideline = (
  <div>
    <h1>Lösungsschritt</h1>
    <p>
      Lösungsschritte <b>untergliedern</b> die Aufgabenlösung in kleine
      Sinnabschnitte. Vermittle dein <b>gedankliches Vorgehen</b> bzw. wichtige{' '}
      <b>Lösungsmethoden</b>.
    </p>
    <ul>
      <li>
        <b>Kleinschrittig:</b>
        <p>
          Formuliere die Lösung in kleinen sowie passenden Lösungsschritten.
        </p>
      </li>
      <li>
        <b>Nachvollziehbar:</b>
        <p>
          Formuliere die Lösung entsprechend dem Niveau der Lernenden (achte auf
          Sprache und Formeln).
        </p>
      </li>
      <li>
        <b>Prozessorientiert: </b>
        <p>
          Formuliere den Weg von der Ausgangssituation zu dem Zielzustand
          schrittweise.
        </p>
      </li>
    </ul>
    <p>
      <b>Beachte: </b>Verwende die richtigen Bausteine, zum Beispiel das
      Gleichungsplugin für Rechnungen.
    </p>
    <BackgroundSymbol>
      {getIcon(SolutionPluginTypes.step, '8x')}
    </BackgroundSymbol>
  </div>
)

export const explanationGuideline = (
  <div>
    <h1>Erklärung eines Schrittes</h1>
    <p>
      Die Erklärung des Schrittes stellt eine <b>detaillierte Erläuterung </b>
      des Lösungsschrittes dar. Dabei kannst du u.a.:
    </p>
    <ul>
      <li>
        <p>
          den <b>Grund</b> für dein gedankliches Vorgehen erläutern
        </p>
      </li>
      <li>
        <p>
          die <b>Funktion</b> des Schrittes erläutern
        </p>
      </li>
    </ul>
    <h1>Zweispaltigkeit</h1>
    <p>
      Damit die Lernenden einen guten Lesefluss haben, kannst du vor allem kurze
      Erklärungen mit dem <Icon icon={faLevelUpAlt} />
      -Symbol neben den vorherigen Lösungsschritt holen. Bitte mache dies nur,
      wenn es keine zu langen Erklärungen sind.
    </p>
    <BackgroundSymbol>
      {getIcon(SolutionPluginTypes.explanation, '8x')}
    </BackgroundSymbol>
  </div>
)

export const additionalsGuideline = (
  <div>
    <h1>Ergänzungen</h1>
    <p>
      Gelegentlich sind nach der Lösung (nach dem letzen Schritt!) der Aufgabe
      noch Ergänzungen sinnvoll.
    </p>
    <p> Dabei könnte es sich um Folgendes handeln:</p>
    <ul>
      <li>
        Weitere Antwortmöglichkeiten, deren vollständige Ausformulierung sich
        nicht lohnt. Alternative Lösungsstrategien.
      </li>
      <li>Zusatzinformationen.</li>
      <li>Anregungen und Links zum Weiterlernen.</li>
    </ul>
    <BackgroundSymbol>
      {getIcon(SolutionPluginTypes.additionals, '8x')}
    </BackgroundSymbol>
  </div>
)
