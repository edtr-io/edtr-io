import { Form, Operator, ExpressionType } from './00_Declarations'
import * as Helper from './01_Helper'
import { MainCatalog } from './20_MainCatalog'

const moduleKey = 'kopfeasy'

// Die untere Grenze der Schwierigkeit - maximal zwei Stellen, kein Übertrag

class GanzEinfacheKopfrechenAddition implements Form<number> {
  ops: Operator[] = ['add', 'sub']
  key: string = moduleKey

  pair(s: number) {
    if (s > 97 || s < 2) return null
    const digits = Helper.toDigits(s)
    if (digits.length == 1) digits.unshift(0)
    const newnumber = [
      Helper.zufallszahl(0, 9 - digits[0]),
      Helper.zufallszahl(0, 9 - digits[1])
    ]
    const newnum = Helper.fromDigits(newnumber)
    if (newnum < 2 || s - newnum < 2) return null
    return newnum
  }

  split(sum: number) {
    if (sum < 5 || sum > 99) return null
    const digits = Helper.toDigits(sum)
    if (digits.length == 1) digits.unshift(0)
    const newnumber = [
      Math.max(0, Helper.zufallszahl(0, digits[0] - 1)),
      Math.max(0, Helper.zufallszahl(0, digits[1] - 1))
    ]
    const newnum = Helper.fromDigits(newnumber)
    if (newnum < 2 || sum - newnum < 2) return null
    return newnum
  }

  free(): [number, number] {
    const rn = Helper.zufallszahl(0, 20)
    if (rn < 2) {
      // Schnapszahlen
      const x = Helper.zufallszahl(1, 8)
      const y = Helper.zufallszahl(1, 9 - x)
      const s1 = Helper.fromDigits([x, x])
      const s2 = Helper.fromDigits([y, y])
      return [s1, s2]
    } else {
      let sum = 0
      const s2 = Helper.sampleSearch(
        () => {
          if (rn < 4) {
            const x = Helper.zufallszahl(2, 9)
            sum = x * 10 + x
          } else sum = Helper.zufallszahl(5, 99)
          return this.split(sum)
        },
        x => x !== null,
        42
      ) as number
      return [sum - s2, s2]
    }
  }
}

// Klassisch: zwei Zahlen [2, 9] werden miteinander multipliziert

class DasKleine1mal1 implements Form<number> {
  ops: Operator[] = ['mul', 'div']
  key: string = moduleKey

  pair(f: number) {
    if (f <= 0 || f > 10) return null
    return Helper.zufallszahl(2, 10)
  }

  split(p: number) {
    const possibilites: [number, number][] = []
    for (let a = 2; a <= 10; a++) {
      for (let b = 2; b <= 10; b++) {
        if (a * b == p) possibilites.push([a, b])
      }
    }
    if (possibilites.length == 0) return null
    return Helper.randomChoice(possibilites)[0]
  }

  free(): [number, number] {
    return [Helper.zufallszahl(2, 9), Helper.zufallszahl(2, 9)]
  }
}

// Die Quadratzahlen bis 100

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
    const b = Helper.zufallszahl(2, 10)
    let e = 2
    if (b == 2 || b == 3) {
      if (Math.random() < 0.3) e = 3
    }
    return [b, e]
  }
}

class Veto {
  key: string = moduleKey

  check(type: ExpressionType, val: number, _ctxt?: number): boolean {
    switch (type) {
      case 'Summand':
      case 'Summe':
      case 'Minuend':
      case 'Subtrahend':
      case 'Differenz':
        return val >= 2 && val < 100
      case 'Faktor':
      case 'Produkt':
      case 'Dividend':
      case 'Divisor':
      case 'Quotient':
        return val >= 2 && val <= 10
    }
    return true
  }
}

export function register() {
  MainCatalog.registerNForm(new GanzEinfacheKopfrechenAddition())
  MainCatalog.registerNForm(new DasKleine1mal1())
  MainCatalog.registerNForm(new QuadratzahlenBis100())
  MainCatalog.registerNVeto(new Veto())
}
