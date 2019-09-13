import {
  Generator,
  GeneratorSet,
  ComposerOptions,
  TeXable,
  NodeType
} from './00_Declarations'
import * as Helper from './01_Helper'
import { TNode } from './05_TNode'

export function ComposerDo(
  _gen: Partial<GeneratorSet>,
  _opts: Partial<ComposerOptions>
): TNode | null {
  // Standardwerte
  let opts: ComposerOptions = {
    plusRel: 6,
    minusRel: 5,
    malRel: 4,
    geteiltRel: 2,
    potenzRel: 1,

    plusMax: -1,
    minusMax: -1,
    malMax: 3,
    geteiltMax: 2,
    potenzMax: 1,

    termpotenz: false,

    tiefe: 6,

    maxTriesPerNode: 3,
    maxGrowTries: 10,
    maxNodeTries: 1000,

    debugOutput: false
  }
  opts = { ...opts, ..._opts }

  // Wenn nur ein Operator, dann darf dieser auch durch eine Potenz erfüllt werden
  if (opts.tiefe == 1) {
    opts.termpotenz = true
  }

  function notImplemented(
    _a: string,
    _b: TeXable,
    _c: TeXable,
    _d: TeXable
  ): [TeXable, TeXable, TeXable] {
    throw 'Generator nicht implementiert!'
  }
  let gen: GeneratorSet = {
    plus: notImplemented,
    minus: notImplemented,
    mal: notImplemented,
    geteilt: notImplemented,
    potenz: notImplemented,
    choice: function(c0: TNode[], c1: TNode[], c2: TNode[]): TNode {
      if (c2.length > 0) {
        return Helper.randomChoice(c2)
      }
      if (c1.length > 0) {
        return Helper.randomChoice(c1)
      }
      if (c0.length > 0) {
        return Helper.randomChoice(c0)
      }
      throw 'Keine Knoten bei Auswahl erhalten!'
    },
    zahl: () => {
      throw 'Zahl nicht implementiert!'
    }
  }
  gen = { ...gen, ..._gen }

  // Alles bereit, um durchzustarten
  if (opts.debugOutput) console.log('--- START ---')
  let iter = 0
  while (iter++ < opts.maxGrowTries) {
    const t = tryFill(generateTree(opts), gen, opts)
    if (t !== null) return t
    else if (opts.debugOutput) {
      console.log('-> Versuch Nr. ' + (iter + 1))
    }
  }
  return null
}

// Platzhalter bei der Generierung des Baums
class DummyValue implements TeXable {
  toTeX(): string {
    return ' ?dummy? '
  }
}

// Ganzen Baum stückweise erzeugen
function generateTree(opts: ComposerOptions): TNode {
  let tree = new TNode('loch', new DummyValue())
  for (let i = 0; i < opts.tiefe; i++) {
    tree = grow1(tree, opts)
  }
  const holes: TNode[] = []
  tree.traverse(node => {
    if (node.type == 'loch') {
      holes.push(node)
    }
  })
  holes.forEach(hole => {
    tree = tree.replace(hole, new TNode('zahl', new DummyValue()))
  })
  return tree
}

interface Countings {
  [propName: string]: number
}

// Fügt dem Termbaum einen Knoten hinzu
function grow1(tree: TNode, opts: ComposerOptions): TNode {
  const holes: TNode[] = []
  const counts: Countings = { plus: 0, minus: 0, mal: 0, geteilt: 0, potenz: 0 }
  tree.traverse(node => {
    if (node.type == 'loch') holes.push(node)
    else if (node.type in counts) {
      counts[node.type]++
    }
  })
  if (holes.length == 0) throw 'Baum kann nicht erweitert werden!'
  const ops = []
  for (const op in counts) {
    if (op == 'potenz' && holes.length <= 1 && !opts.termpotenz) continue // Vermeide unerweiterbare Bäume
    // Falls Max noch nicht erreicht, füge anteilig hinzu
    const maximalValue: number = _getOpt(opts, op + 'Max')
    const relation: number = _getOpt(opts, op + 'Rel')
    if (maximalValue == -1 || counts[op] < maximalValue) {
      for (let i = 0; i < relation; i++) {
        ops.push(op)
      }
    }
  }
  const curHole = Helper.randomChoice(holes)
  const curOp = Helper.randomChoice(ops)
  const newNode = new TNode(curOp as NodeType, new DummyValue())
  let t1 = 'loch'
  let t2 = 'loch'
  if (curOp == 'potenz') {
    t2 = 'zahl'
    if (!opts.termpotenz) t1 = 'zahl'
  }
  newNode.children = [
    new TNode(t1 as NodeType, new DummyValue()),
    new TNode(t2 as NodeType, new DummyValue())
  ]
  return tree.replace(curHole, newNode)
}

interface Entry {
  tree: TNode
  tries: number
}

// Versuche, den Baum mit richtigen Werten zu füllen
function tryFill(
  tree: TNode,
  gen: GeneratorSet,
  opts: ComposerOptions
): TNode | null {
  function isDummy(node: TNode): boolean {
    return node.value instanceof DummyValue
  }

  function isDone(tree: TNode): boolean {
    let done = true
    tree.traverse(node => {
      if (isDummy(node)) done = false
    })
    return done
  }

  if (tree.children.length == 0 && tree.type == 'zahl') {
    return new TNode('zahl', gen.zahl())
  }

  // Der Auffüllverlauf, um zurückspringen zu können
  let treeStack: Entry[] = [{ tree: tree, tries: 0 }]
  let watchdog = opts.maxNodeTries

  while (!isDone(Helper.last(treeStack).tree)) {
    // Maximale Anzahl von Versuchen nicht überschreiiten
    if (watchdog-- <= 0) {
      //console.log("Maximale Anzahl Versuch ausgeschöpft mit:")
      //console.log(Helper.last(treeStack).tree.print())
      if (opts.debugOutput)
        console.log(
          'Mehr als ' + opts.maxNodeTries + ' Versuche, starte neu ...'
        )
      return null
    }

    // Neuer Versuch, Baum davor kopieren
    const newTree = Helper.last(treeStack).tree.clone()

    // Knoten nach Anzahl freier Stellen sortieren
    const nodes: [TNode[], TNode[], TNode[], TNode[]] = [[], [], [], []]
    newTree.traverse((node: TNode) => {
      if (node.type == 'zahl') return
      const lnode = node.left()
      const rnode = node.right()
      if (node.type == 'loch' || !lnode || !rnode)
        throw 'TNode ungültig beim Auffüllen!'
      let filled = 0
      if (!isDummy(node)) filled++
      if (!isDummy(lnode)) filled++
      if (!isDummy(rnode)) filled++
      nodes[filled].push(node)
    })

    // Zur Sicherheit: vollständige Knoten bei jedem Schritt überprüfen
    nodes[3].forEach((node: TNode) => {
      const lnode = node.left(),
        rnode = node.right()
      if (lnode && rnode) {
        const vgen: Generator = _getOpt(gen, node.type)
        if (!vgen('validate', lnode.value, rnode.value, node.value)) {
          console.log(node.type)
          console.log(lnode.value.toTeX())
          console.log(rnode.value.toTeX())
          console.log(node.value.toTeX())
          console.log(newTree.print())
          throw 'Baum ist inkonsistent.'
        }
      }
    })

    if (nodes[0].length + nodes[1].length + nodes[2].length == 0) {
      throw 'Kein Knoten gefunden, aber Baum unvollständig?'
    }

    // Lasse den Generator den nächsten Knoten bestimmen
    const node = gen.choice(nodes[0], nodes[1], nodes[2])
    let action = 'none'
    if (nodes[2].includes(node)) action = 'complete'
    if (nodes[1].includes(node)) action = 'gen_dep'
    if (nodes[0].includes(node)) action = 'gen_free'

    if (action == 'none') {
      throw 'Choice-Funktion hat unbekannten Knoten zurückgeliefert!'
    }

    const lnode = node.left()
    const rnode = node.right()

    if (!lnode || !rnode) {
      throw 'Komischer Knoten!'
    }

    // Erzeuge Werte
    const vgen: Generator = _getOpt(gen, node.type)
    const result = vgen(action, lnode.value, rnode.value, node.value)
    if (result === null) {
      // Diese Auswahl hat nicht funktioniert
      const tries = ++Helper.last(treeStack).tries
      if (action == 'complete' || tries >= opts.maxTriesPerNode) {
        treeStack.pop()
        if (treeStack.length == 0) treeStack = [{ tree: tree, tries: 0 }]
        continue
      }
    } else {
      // Schreibe Werte in den Baum
      lnode.value = result[0]
      rnode.value = result[1]
      node.value = result[2]
      treeStack.push({ tree: newTree, tries: 0 })
    }
  }

  if (opts.debugOutput)
    console.log(
      'Baum erzeugt in ' + (opts.maxNodeTries - watchdog) + ' Schritten'
    )

  return Helper.last(treeStack).tree
}

// Ein bisschen hacky
function _getOpt(opts: {}, key: string): any {
  if (key in opts) {
    // Komfort ... mehr ist es nicht
    return (opts as any)[key]
  } else {
    throw "Zugriff auf unbekannte Eigenschaft '" + key + "'!"
  }
}
