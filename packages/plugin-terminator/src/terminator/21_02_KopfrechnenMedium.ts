import { Form, Operator } from './00_Declarations'
import * as Helper from './01_Helper'
import { MainCatalog } from './20_MainCatalog'

const moduleKey = 'kopfmedium'

// Die normale Schwierigkeit - Rechnen im Hunderterbereich, inkl. Übertrag und Multiplikationen über das Einmaleins hinaus

class EinfacheKopfrechenAddition implements Form<number> {
  ops: Operator[] = ['add', 'sub']
  key: string = moduleKey

  pair(s: number) {
    if (s > 97) return null
    return Helper.zufallszahl(2, 99 - s)
  }

  split(sum: number) {
    if (sum < 4) return null
    const x = Helper.zufallszahl(1, sum - 2)
    return Helper.randomChoice([x, sum - x])
  }

  free(): [number, number] {
    // FIXME
    const me = this
    function sample() {
      const x = Helper.zufallszahl(10, 99)
      const y = me.split(x) as number
      return Helper.shuffle2([y, x - y])
    }

    const disc = Helper.zufallszahl(0, 9)
    if (disc < 5) {
      // erzeuge Aufgabe mit Übertrag
      const res = Helper.sampleSearch(
        sample,
        (val: [number, number]) => (val[0] % 10) + (val[1] % 10) > 10,
        [22, 42]
      )
      return res
    } else if (disc < 8) {
      // kümmere mich nicht darum
      return sample()
    } else if (disc == 8) {
      // Sonderfall mit 5er-Vielfachen
      const res = Helper.zufallszahl(3, 19)
      const s1 = Helper.zufallszahl(1, res - 1)
      return [s1 * 5, (res - s1) * 5]
    } else {
      const x = Helper.zufallszahl(14, 49)
      return Helper.shuffle2([x, x - 9])
    }
  }
}

// Im Hunderterbereich bleiben

const mulPos: [number, number][] = []

class DasKleine1mal1 implements Form<number> {
  ops: Operator[] = ['mul', 'div']
  key: string = moduleKey

  pair(f: number) {
    const candids = mulPos.filter(([x, _]) => x == f)
    if (candids.length == 0) return null
    return Helper.randomChoice(candids)[1]
  }

  split(p: number) {
    const candids = mulPos.filter(([x, y]) => x * y == p)
    if (candids.length == 0) return null
    return Helper.randomChoice(candids)[0]
  }

  free(): [number, number] {
    if (mulPos.length == 0) {
      // generate on demand
      for (let res = 4; res < 100; res++) {
        for (let f = 2; f < res; f++) {
          if (Math.floor(res / f) * f == res) mulPos.push([f, res / f])
        }
      }
    }
    const disc = Helper.zufallszahl(0, 9)
    if (disc < 5) {
      return Helper.randomChoice(mulPos)
    } else {
      return [Helper.zufallszahl(2, 9), Helper.zufallszahl(2, 9)]
    }
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
  MainCatalog.registerNForm(new DasKleine1mal1())
  MainCatalog.registerNForm(new QuadratzahlenBis100())
}
