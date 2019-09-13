import { Form, Operator, Veto, ExpressionType } from './00_Declarations'
import * as Helper from './01_Helper'
import { Frac } from './15_Frac'
import { MainCatalog } from './20_MainCatalog'

const moduleKey = 'fracbasic'

class BruchrechnungEinfachAddSub implements Form<Frac> {
  ops: Operator[] = ['add', 'sub']
  key: string = moduleKey

  pair(s: Frac) {
    const disc = 1
    if (disc < 0.05 && s.den != 1) {
      // Partner mit ganzer Zahl
      return new Frac(Helper.zufallszahl(2, 9))
    } else if (disc < 0.25) {
      // Gleichnamiger Partner
      const num = findCoprime(s.den, s.den - 1)
      const ganze = Helper.zufallszahl(0, 4)
      return new Frac(num + ganze * s.den, s.den)
    } else {
      // Ungleichnamiger Partner
      // Wir müssen uns jetzt noch anschauen, ob der Nenner größer oder kleiner werden soll
      if (s.den <= 20 && (Math.random() < 0.5 || s.den <= 4)) {
        // Bitte größer
        let maxd = 60
        if (Math.random() < 0.2) {
          maxd = 99
        }
        const den2 = Helper.sampleSearch(
          () => Helper.zufallszahl(2, 100),
          x => {
            const newd = (x * s.den) / Helper.gcd(x, s.den)
            return newd <= maxd && newd > s.den
          },
          s.den
        )
        const num = findCoprime(den2, den2 - 1)
        let ganze = 0
        if (Math.random() < 0.6) ganze = Helper.zufallszahl(0, 4)
        return new Frac(ganze * den2 + num, den2)
      } else {
        // Versuche kleiner zu machen
        const teiler: number[] = []
        for (let i = 2; i <= s.den; i++) {
          if (Math.floor(s.den / i) * i == s.den) {
            teiler.push(i)
          }
        }
        const [num2, den2] = Helper.sampleSearch(
          () => [Helper.zufallszahl(1, 50), Helper.randomChoice(teiler)],
          ([d, n]) => {
            const t = s.add(new Frac(d, n))
            return t.den < s.den && Math.floor(t.num / t.den) < 10
          },
          [1, s.den]
        )
        return new Frac(num2, den2)
      }
    }
  }

  split(sum: Frac) {
    let den = sum.den
    let num = sum.num

    // In diesen Fällen ... lasst uns mal überlegen ...
    if (den == 1) {
      den = Helper.zufallszahl(2, 15)
      num *= den
    }
    if (sum.num < 4) return null
    if (Math.random() < 0.5) {
      // gleichnamig aufteilen
      const newnum = Helper.zufallszahl(1, num - 1)
      return new Frac(newnum, den)
    } else {
      // ungleichnamig aufteilen
      // Puh, wie soll das denn gehen?
      const [newnum, newden] = Helper.sampleSearch(
        () => [Helper.zufallszahl(1, num - 1), den * Helper.zufallszahl(1, 9)],
        ([nu, de]) => {
          const t = new Frac(nu, de)
          const t2 = sum.sub(t)
          return t.den != t2.den && t.den < 100 && t2.den < 100
        },
        [1, den]
      )
      return new Frac(newnum, newden)
    }
  }

  free(): [Frac, Frac] {
    const p1 = rSimpleFrac()
    let p2 = this.pair(p1)
    if (p2 === null) {
      p2 = rSimpleFrac()
    }
    return Helper.shuffle2([p1, p2])
  }
}

function findCoprime(p: number, maxr: number) {
  return Helper.sampleSearch(
    () => Helper.zufallszahl(1, maxr),
    x => Helper.gcd(x, p) == 1,
    1
  )
}

function rSimpleFrac(): Frac {
  const den = Helper.zufallszahl(2, 20)
  const num = findCoprime(den, den - 1)
  let ganze = Helper.zufallszahl(0, 4)
  if (Math.random() < 0.4) ganze = 0
  return new Frac(num + ganze * den, den)
}

class BruchrechnungMulDiv implements Form<Frac> {
  ops: Operator[] = ['mul', 'div']
  key: string = moduleKey

  pair(f: Frac) {
    // Zwei Zahlen, die multipliziert ein sinnvolles Ergebnis bilden ...
    if (f.num > 50 || f.den > 50) {
      return null
    }
    const [num, den] = Helper.sampleSearch(
      () => [Helper.zufallszahl(1, 20), Helper.zufallszahl(2, 20)],
      ([num, den]) => {
        const t = new Frac(num * f.num, den * f.den)
        return t.num < 100 && t.den < 100
      },
      [3, 4]
    )
    const res = new Frac(num, den)
    if (res.den == 1) return null
    return res
  }

  split(p: Frac) {
    if (p.num < 3 || p.den < 3) return null

    const [newnum, newden] = Helper.sampleSearch(
      () => [
        Helper.zufallszahl(2, p.num - 1),
        Helper.zufallszahl(2, p.den - 1)
      ],
      ([num, den]) => (p.num * den) % num == 0 && (p.den * num) % den == 0,
      [1, 1]
    )
    const f = new Frac(newnum, newden)
    if (f.den == 1) return null
    return f
  }

  free(): [Frac, Frac] {
    let res: Frac
    if (Math.random() < 0.4) {
      res = new Frac(Helper.zufallszahl(2, 9))
    } else {
      res = new Frac(Helper.zufallszahl(2, 20), Helper.zufallszahl(2, 20))
      while (res.den == 1) {
        res = new Frac(Helper.zufallszahl(2, 20), Helper.zufallszahl(2, 20))
      }
    }
    const other = Helper.sampleSearch(
      () => this.pair(res),
      f => f !== null,
      rSimpleFrac()
    ) as Frac
    return Helper.shuffle2([res, other])
  }
}

/*class BoringStandardDivision implements Form<number> {
    ops: Operator[] = ["div"]
    key: string = moduleKey

    private divBy = [2,3,4,5,6,7,8,9,10,11,15,20,30,40,50,60,70,80,90,100]

    pair(x: number) {
      if (x < 12) {
        return Math.round(Math.random()*300) + 100
      } else {
        return Helper.randomChoice(this.divBy)
      }
    }

    split(x: number) {
      for (let i = 0; i < this.divBy.length; i++) {
        if (Math.floor(x / this.divBy[i])*this.divBy[i] == x) {
          return this.divBy[i]
        }
      }
      return null
    }

    free(): [number, number] {
      let x = Helper.randomChoice(this.divBy)
      let y = 100 + Math.round(Math.random()*300)
      return Helper.shuffle2([x, y])
    }
  }

  // Die Quadratzahlen bis 100
  let potenzen: [number, number][] = []

  class QuadratzahlenBis100 implements Form<number> {
    ops: Operator[] = ["pow"]
    key: string = moduleKey

    split(b: number): number | null {
      return null
    }

    pair(b: number): number | null {
      if (b * b * b < 5000)
        return 3
      if (b * b < 5000)
        return 2
      return null
    }

    free(): [number, number] {
      if (potenzen.length == 0) {
        for (let b = 2; b <= 25; b++) {
          for (let e = 2; e <= 7; e++) {
            if (e == 2 || Math.pow(b, e) < 300)
              potenzen.push([b, e])
          }
        }
      }

      return Helper.randomChoice(potenzen)
    }
  }*/

class SimpleVeto implements Veto<Frac> {
  key: string = moduleKey

  check(type: ExpressionType, val: Frac, _ctxt?: Frac): boolean {
    return val.sign() == 'pos' && val.den < 100 && val.num < 100
  }
}

export function register() {
  MainCatalog.registerForm(new BruchrechnungEinfachAddSub())
  MainCatalog.registerForm(new BruchrechnungMulDiv())
  MainCatalog.registerVeto(new SimpleVeto())
  /*MainCatalog.registerNForm(new ExotischeMulDiv())
  MainCatalog.registerNForm(new BoringStandardDivision())
  MainCatalog.registerNForm(new QuadratzahlenBis100())*/
}
