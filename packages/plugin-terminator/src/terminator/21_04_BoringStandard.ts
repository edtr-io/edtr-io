import { Form, Operator } from './00_Declarations'
import * as Helper from './01_Helper'
import { MainCatalog } from './20_MainCatalog'

const moduleKey = 'large'

// Die normale Schwierigkeit - Rechnen im Hunderterbereich, inkl. Übertrag und Multiplikationen über das Einmaleins hinaus

class EinfacheKopfrechenAddition implements Form<number> {
  ops: Operator[] = ['add', 'sub']
  key: string = moduleKey

  pair(s: number) {
    return Math.round(Math.random() * Math.max(s, 200) * 2) + 3
  }

  split(sum: number) {
    if (sum < 6) return null
    return Math.floor(Math.random() * (sum - 3) + 3)
  }

  free(): [number, number] {
    const len1 = Helper.zufallszahl(3, 5)
    const s1 = Helper.zufallszahl(3, Math.pow(10, len1))
    const s2 = Helper.zufallszahl(3, Math.pow(10, len1))
    return [s1, s2]
  }
}

class ExotischeMulDiv implements Form<number> {
  ops: Operator[] = ['mul']
  key: string = moduleKey

  pair(f: number) {
    if (f < 2) return null
    return Math.round(Math.random() * 100) + 2
  }

  split(p: number) {
    for (let i = 0; i < p; i++) {
      const f1 = Math.max(Math.floor(Math.random() * p), 2)
      if (p / f1 < 3) continue
      if (Math.floor(p / f1) * f1 == p) {
        return f1
      }
    }
    return null
  }

  free(): [number, number] {
    /*const l1 = Helper.zufallszahl(1, 2)
    const l2 = Helper.zufallszahl(1, 2)
    const f1 = Helper.zufallszahl(2, Math.pow(10, l1))
    const f2 = Helper.zufallszahl(2, Math.pow(10, l2))*/
    return [
      Math.round(Math.random() * 100) + 2,
      Math.round(Math.random() * 100) + 2
    ]
  }
}

class BoringStandardDivision implements Form<number> {
  ops: Operator[] = ['div']
  key: string = moduleKey

  private divBy = [
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    15,
    20,
    30,
    40,
    50,
    60,
    70,
    80,
    90,
    100
  ]

  pair(x: number) {
    if (x < 12) {
      return Math.round(Math.random() * 300) + 100
    } else {
      return Helper.randomChoice(this.divBy)
    }
  }

  split(x: number) {
    for (let i = 0; i < this.divBy.length; i++) {
      if (Math.floor(x / this.divBy[i]) * this.divBy[i] == x) {
        return this.divBy[i]
      }
    }
    return null
  }

  free(): [number, number] {
    const x = Helper.randomChoice(this.divBy)
    const y = 100 + Math.round(Math.random() * 300)
    return Helper.shuffle2([x, y])
  }
}

// Die Quadratzahlen bis 100
const potenzen: [number, number][] = []

class QuadratzahlenBis100 implements Form<number> {
  ops: Operator[] = ['pow']
  key: string = moduleKey

  split(_b: number): number | null {
    return null
  }

  pair(b: number): number | null {
    if (b * b * b < 5000) return 3
    if (b * b < 5000) return 2
    return null
  }

  free(): [number, number] {
    if (potenzen.length == 0) {
      for (let b = 2; b <= 25; b++) {
        for (let e = 2; e <= 7; e++) {
          if (e == 2 || Math.pow(b, e) < 300) potenzen.push([b, e])
        }
      }
    }

    return Helper.randomChoice(potenzen)
  }
}

export function register() {
  MainCatalog.registerNForm(new EinfacheKopfrechenAddition())
  MainCatalog.registerNForm(new ExotischeMulDiv())
  MainCatalog.registerNForm(new BoringStandardDivision())
  MainCatalog.registerNForm(new QuadratzahlenBis100())
}
