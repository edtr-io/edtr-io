import { NodeType, TeXable } from './00_Declarations'

// Ein Baumknoten, Term-Node oder TeX-Node
export class TNode implements TeXable {
  readonly type: NodeType

  // Minimalanforderung ist Ausgabe als TeX
  value: TeXable

  children: TNode[]

  divAsFrac: boolean

  constructor(type: NodeType, value: TeXable) {
    this.type = type
    this.value = value
    this.children = []
    this.divAsFrac = false
  }

  // Durchläuft Knoten und Kindknoten
  traverse(f: (n: TNode) => void) {
    f(this)
    this.children.forEach(n => n.traverse(f))
  }

  // Ersetzt einen Knoten innerhalb eines Baums, modifiziert den Baum und gibt diesen zurück
  replace(oldn: TNode, newn: TNode): TNode {
    if (oldn == this) return newn
    this.children = this.children.map(subnode => subnode.replace(oldn, newn))
    return this
  }

  // Tiefe Kopie dieses Knotens
  clone(): TNode {
    const newNode = new TNode(this.type, this.value)
    newNode.children = this.children.map((child: TNode) => child.clone())
    return newNode
  }

  // Gibt den Baum in S-Expressions aus
  print(): string {
    return `(${this.type}:${this.value.toTeX()} ${this.children
      .map(child => child.print())
      .join(' ')})`
  }

  left(): TNode | undefined {
    return this.children[0]
  }

  right(): TNode | undefined {
    return this.children[1]
  }

  toTeX(): string {
    return ConvertToTeX(this, this.divAsFrac)
  }
}

function ConvertToTeX(tree: TNode, divAsFrac = false): string {
  if (tree.type == 'zahl') {
    return tree.value.toTeX()
  } else if (tree.type == 'loch') {
    return ' ?loch? '
  } else {
    const lchild = tree.left()
    const rchild = tree.right()
    if (lchild && rchild) {
      let lt = ConvertToTeX(lchild, divAsFrac)
      let rt = ConvertToTeX(rchild, divAsFrac)
      const ltype = lchild.type
      const rtype = rchild.type

      switch (tree.type) {
        case 'plus':
          return lt + ' + ' + rt
        case 'minus':
          if (rtype == 'plus' || rtype == 'minus') {
            rt = parentize(rt)
          }
          return lt + ' - ' + rt
        case 'mal':
          if (ltype == 'plus' || ltype == 'minus') {
            lt = parentize(lt)
          }
          if (rtype == 'plus' || rtype == 'minus') {
            rt = parentize(rt)
          }
          if (rtype == 'geteilt') {
            // Diese Klammer verändert den Termwert nicht, also nicht strikt notwendig
            // Allerdings wirkt es ohne diese Klammer komisch
            rt = parentize(rt)
          }
          return lt + ' \\cdot ' + rt
        case 'geteilt':
          if (divAsFrac) return ' \\frac{ ' + lt + ' }{ ' + rt + ' } '
          else {
            if (ltype == 'plus' || ltype == 'minus') {
              lt = parentize(lt)
            }
            if (
              rtype == 'plus' ||
              rtype == 'minus' ||
              rtype == 'mal' ||
              rtype == 'geteilt'
            ) {
              rt = parentize(rt)
            }
            return lt + ' : ' + rt
          }
        case 'potenz':
          if (
            ltype == 'plus' ||
            ltype == 'minus' ||
            ltype == 'mal' ||
            ltype == 'geteilt' ||
            (ltype == 'zahl' && lt.includes('frac') && lt.indexOf('-') <= 0)
          ) {
            lt = parentize(lt)
          }
          // Negativer Exponent in Klammern wird von seinen Klammern befreit
          // ( - 534) --> - 534
          //rt = rt.replace(/\(\s*(-\s*\d+)\s*\)/, "$1")
          return ' { ' + lt + ' } ^ { ' + rt + ' } '
      }
      throw 'Interner Fehler!'
    } else {
      throw 'Unvollständiger Baum'
    }
  }
}

// Klammert einen Term, nutzt pro Ebene verschiedene Klammern
function parentize(tex: string): string {
  if (!tex.includes('(')) return ' \\left( ' + tex + ' \\right) '
  else if (!tex.includes('[')) return ' \\left[ ' + tex + ' \\right] '
  else return ' \\left\\{ ' + tex + ' \\right\\} '
}
