import { name, states } from '@edtr-io/plugin-solution/__fixtures__'

import { addPluginStories, addStory } from '../src'

addPluginStories({
  name: 'Solution',
  plugin: name,
  states: states
})

addStory('Plugins/Solution/Prefilled', {
  state: JSON.parse(
    '{"plugin": "solution", "state": {"title": "", "content":{"plugin":"solutionSteps","state":{"introduction":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"Zur Bearbeitung dieser Aufgabe benötigst du den ","marks":[]},{"object":"inline","type":"@splish-me/a","data":{"href":"TODO"},"nodes":[{"object":"text","text":"Satz des Pythagoras","marks":[]}]},{"object":"text","text":".","marks":[]}]}]}}},"strategy":{"plugin": "rows", "state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"Arbeitest du mit ","marks":[]},{"object":"inline","type":"@splish-me/a","data":{"href":"FakeURL"},"nodes":[{"object":"text","text":"Formeln","marks":[]}]},{"object":"text","text":" und ","marks":[]},{"object":"inline","type":"@splish-me/a","data":{"href":""},"nodes":[{"object":"text","text":"Gleichungen","marks":[]}]},{"object":"text","text":", so ist es oft nützlich, die Gleichungen erst nach der gesuchten Angabe ","marks":[]},{"object":"inline","type":"@splish-me/a","data":{"href":""},"nodes":[{"object":"text","text":"umzuformen","marks":[]}]},{"object":"text","text":".","marks":[]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"Außerdem kann es nützlich sein, die gegebenen und gesuchten Werte aus der Angabe heraus zu schreiben.","marks":[]}]}]}}}]},"hasStrategy":true,"solutionSteps":[{"type":"explanation","isHalf":false,"content":{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"@splish-me/h2","data":{},"nodes":[{"object":"text","text":"Vorarbeit","marks":[]}]}]}}},{"plugin":"text","state":{"document":{"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"Lies zunächst aus der Angabe alle gegeben Größen aus und überlege dir, was gesucht ist.","marks":[]}]}]}}}]}},{"type":"step","isHalf":true,"content":{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"Gegeben:","marks":[]}]}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"","marks":[]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"a=3\\\\ cm,\\\\ c=\\\\ 5\\\\ cm","inline":true},"nodes":[{"object":"text","text":"","marks":[]}]},{"object":"text","text":"","marks":[]}]}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"Gesucht:","marks":[]}]}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"","marks":[]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"b=?","inline":true},"nodes":[{"object":"text","text":"","marks":[]}]},{"object":"text","text":"","marks":[]}]}]}}}]}},{"type":"explanation","isHalf":true,"content":{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"Schreib dir die Formel zum Satz des Pythagoras auf. ","marks":[]}]}]}}}]}},{"type":"step","isHalf":true,"content":{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"","marks":[]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"a^2+b^2=c^2","inline":true},"nodes":[{"object":"text","text":"","marks":[]}]},{"object":"text","text":"","marks":[]}]}]}}}]}},{"type":"explanation","isHalf":true,"content":{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"Forme nach dem Gesuchten um.","marks":[]}]}]}}}]}},{"type":"step","isHalf":false,"content":{"plugin":"rows","state":[{"plugin":"equations","state":{"steps":[{"left":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"","marks":[]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"a^2+b^2=","inline":true},"nodes":[{"object":"text","text":"","marks":[]}]},{"object":"text","text":"","marks":[]}]}]}}},"right":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"","marks":[]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"c^2","inline":true},"nodes":[{"object":"text","text":"","marks":[]}]},{"object":"text","text":"","marks":[]}]}]}}},"transform":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"|","marks":[]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"-a^2","inline":true},"nodes":[{"object":"text","text":"","marks":[]}]},{"object":"text","text":"","marks":[]}]}]}}}},{"left":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"","marks":[]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"b^2=","inline":true},"nodes":[{"object":"text","text":"b^2 =c^2-a^2","marks":[]}]},{"object":"text","text":"","marks":[]}]}]}}},"right":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"","marks":[]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"c^2-a^2","inline":true},"nodes":[{"object":"text","text":"c^2-a^2","marks":[]}]},{"object":"text","text":"","marks":[]}]}]}}},"transform":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"|","marks":[]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"\\\\sqrt{\\\\ \\\\ \\\\ }","inline":true},"nodes":[{"object":"text","text":"","marks":[]}]},{"object":"text","text":"","marks":[]}]}]}}}},{"left":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"","marks":[]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"b=","inline":true},"nodes":[{"object":"text","text":"","marks":[]}]},{"object":"text","text":"","marks":[]}]}]}}},"right":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"","marks":[]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"\\\\sqrt{c^2-a^2}","inline":true},"nodes":[{"object":"text","text":"","marks":[]}]},{"object":"text","text":"","marks":[]}]}]}}},"transform":{"plugin":"text","state":{"document":{"nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text"}]}]}}}}]}}]}},{"type":"explanation","isHalf":false,"content":{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"Setze die gegebenen Werte ein und berechne.","marks":[]}]}]}}}]}},{"type":"step","isHalf":false,"content":{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"@splish-me/h2","data":{},"nodes":[{"object":"text","text":"Berechnung","marks":[]}]}]}}},{"plugin":"equations","state":{"steps":[{"left":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"","marks":[]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"b=","inline":true},"nodes":[{"object":"text","text":"","marks":[]}]},{"object":"text","text":"","marks":[]}]}]}}},"right":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"","marks":[]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"\\\\sqrt{\\\\left(5cm\\\\right)^2-\\\\left(3cm\\\\right)^2}","inline":true},"nodes":[{"object":"text","text":"","marks":[]}]},{"object":"text","text":"","marks":[]}]}]}}},"transform":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"Berechne die ","marks":[]},{"object":"inline","type":"@splish-me/a","data":{"href":"FakeURL"},"nodes":[{"object":"text","text":"Potenzen","marks":[]}]},{"object":"text","text":".","marks":[]}]}]}}}},{"left":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"","marks":[]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"b=","inline":true},"nodes":[{"object":"text","text":"b=","marks":[]}]},{"object":"text","text":"","marks":[]}]}]}}},"right":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"","marks":[]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"\\\\sqrt{25cm^2-9cm^2}","inline":true},"nodes":[{"object":"text","text":"","marks":[]}]},{"object":"text","text":"","marks":[]}]}]}}},"transform":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"Berechne die Differenz.","marks":[]}]}]}}}},{"left":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"","marks":[]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"b=","inline":true},"nodes":[{"object":"text","text":"","marks":[]}]},{"object":"text","text":"","marks":[]}]}]}}},"right":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"","marks":[]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"\\\\sqrt{16cm^2}","inline":true},"nodes":[{"object":"text","text":"","marks":[]}]},{"object":"text","text":"","marks":[]}]}]}}},"transform":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"","marks":[]},{"object":"inline","type":"@splish-me/a","data":{"href":"Fakelink"},"nodes":[{"object":"text","text":"Radiziere","marks":[]}]},{"object":"text","text":".","marks":[]}]}]}}}},{"left":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"","marks":[]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"b=","inline":true},"nodes":[{"object":"text","text":"","marks":[]}]},{"object":"text","text":"","marks":[]}]}]}}},"right":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"","marks":[]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"4cm","inline":true},"nodes":[{"object":"text","text":"","marks":[]}]},{"object":"text","text":"","marks":[]}]}]}}},"transform":{"plugin":"text","state":{"document":{"nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text"}]}]}}}}]}}]}}],"additionals":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"@splish-me/h2","data":{},"nodes":[{"object":"text","text":"Jetzt bist du dran!","marks":[]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"Findest du weitere Aufgaben zum Satz des Pythagoras, die du ohne Taschenrechner lösen kannst? Probier doch einfach mal ein paar Zahlenwerte aus und lege die gefundenen Zahlentrios als Aufgabe unter dieser Aufgabe an, falls noch niemand anders sie angelegt hat.","marks":[]}]}]}}},"hasAdditionals":true}}}}'
  )
})
