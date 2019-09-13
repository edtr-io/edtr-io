import { Form, Operator } from './00_Declarations'
import * as Helper from './01_Helper'
import { MainCatalog } from './20_MainCatalog'

const moduleKey = 'kopfexotic'

// Die normale Schwierigkeit - Rechnen im Hunderterbereich, inkl. Übertrag und Multiplikationen über das Einmaleins hinaus

class EinfacheKopfrechenAddition implements Form<number> {
  ops: Operator[] = ['add', 'sub']
  key: string = moduleKey

  pair(_s: number) {
    return null
  }

  split(_sum: number) {
    return null
  }

  free(): [number, number] {
    const t = Helper.zufallszahl(0, 10)
    if (t < 1) {
      // lauter gleiche Ziffern
      const digits = Helper.zufallszahl(3, 6)
      const d1 = Helper.zufallszahl(3, 9)
      const d2 = Helper.zufallszahl(1, d1 - 1)
      const num1: number[] = []
      const num2: number[] = []
      for (let i = 0; i < digits; i++) {
        num1.push(d1 - d2)
        num2.push(d2)
      }
      return Helper.shuffle2([Helper.fromDigits(num1), Helper.fromDigits(num2)])
    } else if (t < 2) {
      // normal + invertiert
      const digits = Helper.zufallszahl(3, 6)
      const d1 = Helper.zufallszahl(digits + 1, 9) // Summe der beiden Ziffern
      const d2 = Helper.zufallszahl(1, d1 - digits - 1) // kleinste Ziffer
      const num1: number[] = []
      const num2: number[] = []
      for (let i = 0; i < digits; i++) {
        num1.push(d2 + i)
        num2.push(d1 - d2 - i)
      }
      return Helper.shuffle2([Helper.fromDigits(num1), Helper.fromDigits(num2)])
    } else if (t < 3 && Math.random() < 0.3) {
      // "binär"
      const num1 = [1]
      const num2 = [1]
      const l1 = Helper.zufallszahl(2, 5)
      const l2 = Helper.zufallszahl(2, 5)
      for (let i = 0; i < l1; i++) {
        num1.push(Helper.zufallszahl(0, 1))
      }
      for (let i = 0; i < l2; i++) {
        num2.push(Helper.zufallszahl(0, 1))
      }
      return [Helper.fromDigits(num1), Helper.fromDigits(num2)]
    } else if (t < 6) {
      // null-Addition
      const innerSize = Helper.zufallszahl(2, 4)
      const outer =
        Math.pow(10, innerSize) *
        Helper.zufallszahl(11, innerSize < 4 ? 200 : 20)
      const innerFilled = Helper.zufallszahl(2, innerSize)
      const inner = Helper.zufallszahl(2, Math.pow(10, innerFilled) - 1)
      if (Math.random() < 0.6) return [outer, inner]
      else return [inner, outer]
    } else if (t < 9) {
      // Zehnerpotenz auffüllend
      const l = Helper.zufallszahl(2, 4)
      const d = Helper.zufallszahl(1, 9)
      const x = Math.pow(10, l) * d
      const s1 = Helper.zufallszahl(4, 40)
      return Helper.shuffle2([x - s1, s1])
    } else {
      // zufallszahlen eingestreut
      return Helper.shuffle2([
        Helper.zufallszahl(3, 30),
        Helper.zufallszahl(10, 200)
      ])
    }
  }
}

class ExotischeMulDiv implements Form<number> {
  ops: Operator[] = []
  key: string = moduleKey
  with101 = true

  pair(_f: number) {
    return null
  }

  split(_p: number) {
    return null
  }

  free(): [number, number] {
    const disc = Helper.zufallszahl(0, this.with101 ? 5 : 4)
    if (disc < 3) {
      const x =
        Helper.zufallszahl(2, 9) * Math.pow(10, Helper.zufallszahl(0, 2))
      const y =
        Helper.zufallszahl(2, 9) * Math.pow(10, Helper.zufallszahl(0, 2))
      return Helper.shuffle2([x, y])
    } else if (disc < 5) {
      const f1 = Helper.zufallszahl(2, 4)
      const max = Math.floor(9 / f1)
      const f2: number[] = []
      const len = Helper.zufallszahl(2, 4)
      for (let i = 0; i < len; i++) {
        if (i == 0) f2.push(Helper.zufallszahl(1, max))
        else f2.push(Helper.zufallszahl(0, max))
      }
      return Helper.shuffle2([f1, Helper.fromDigits(f2)])
    } else {
      const f1 = Helper.randomChoice([11, 101, 1001, 110])
      const f2: number[] = []
      const len = Helper.zufallszahl(2, 4)
      for (let i = 0; i < len; i++) {
        f2.push(Helper.zufallszahl(1, 4))
      }
      return Helper.shuffle2([f1, Helper.fromDigits(f2)])
    }
    return [1, 1]
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
    if (b * b <= 100) return 2
    return null
  }

  free(): [number, number] {
    if (potenzen.length == 0) {
      for (let b = 2; b < 10; b++) {
        for (let e = 2; e < 8; e++) {
          if (Math.pow(b, e) < 100) potenzen.push([b, e])
        }
      }
    }

    return Helper.randomChoice(potenzen)
  }
}

export function register() {
  MainCatalog.registerNForm(new EinfacheKopfrechenAddition())

  const mul = new ExotischeMulDiv()
  mul.ops = ['mul']
  mul.with101 = true
  MainCatalog.registerNForm(mul)

  const div = new ExotischeMulDiv()
  div.ops = ['div']
  div.with101 = false
  MainCatalog.registerNForm(div)

  MainCatalog.registerNForm(new QuadratzahlenBis100())
}
