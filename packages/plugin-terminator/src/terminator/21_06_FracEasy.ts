import { Form, Operator, Veto, ExpressionType } from './00_Declarations'
import * as Helper from './01_Helper'
import { Frac } from './15_Frac'
import { MainCatalog } from './20_MainCatalog'

const moduleKey = 'fraceasy'

type modus = 'gleichnamig' | 'vielfaches' | 'teiler' | 'frei' | 'ganze'

function findCoprime(p: number, maxr: number = p - 1) {
  return Helper.sampleSearch(
    () => Helper.zufallszahl(1, maxr),
    x => Helper.gcd(x, p) == 1,
    1
  )
}

function buildFracWithDen(den: number, ganze: number) {
  const newnum = findCoprime(den, den - 1)
  const newganze = Helper.zufallszahl(0, ganze)
  return new Frac(newnum, den).add(new Frac(newganze))
}

class EinfacheBruchAddSub implements Form<Frac> {
  ops: Operator[] = ['add', 'sub']
  key: string = moduleKey

  pair(s: Frac) {
    const ganze = Math.floor(s.num / s.den)
    //const zaehler = s.sub(new Frac(ganze)).num

    let mod: modus
    if (s.den == 1) {
      mod = 'frei'
    } else if (s.den > 1 && s.den <= 10) {
      const disc = Math.random()
      if (disc < 0.05) mod = 'ganze'
      else if (disc < 0.55) mod = 'frei'
      else if (disc < 0.7) mod = 'teiler'
      else if (disc < 0.85) mod = 'vielfaches'
      else mod = 'gleichnamig'
    } else {
      const disc = Math.random()
      if (disc < 0.05) mod = 'ganze'
      else if (disc < 0.6) mod = 'teiler'
      else mod = 'gleichnamig'
    }

    if (mod == 'ganze') {
      return new Frac(Helper.zufallszahl(2, Math.max(3, ganze * 2)))
    } else if (mod == 'gleichnamig') {
      return buildFracWithDen(s.den, ganze)
    } else if (mod == 'vielfaches') {
      return buildFracWithDen(Helper.zufallszahl(2, 10) * s.den, ganze)
    } else if (mod == 'teiler') {
      const teiler: number[] = []
      for (let i = 2; i < s.den; i++) {
        if (s.den % i == 0 && s.den / i < 12 && i < 12) teiler.push(i)
      }
      if (teiler.length == 0) return null
      return buildFracWithDen(Helper.randomChoice(teiler), ganze)
    } else if (mod == 'frei') {
      let dens = [2, 3, 4, 5, 6, 7, 8, 9, 10]
      dens = dens.filter(d => d != s.den)
      return buildFracWithDen(Helper.randomChoice(dens), ganze)
    }

    return null
  }

  split(s: Frac) {
    const ganze = Math.floor(s.num / s.den / 1.5)
    let res: Frac | null = null
    if (s.den <= 10 && Math.random() < 0.4) {
      const d2 = Helper.zufallszahl(2, 10) * s.den
      res = buildFracWithDen(d2, ganze)
    } else if (Math.random() < 0.5) {
      const t: number[] = []
      for (let i = 2; i < s.den; i++) {
        if (s.den % i == 0 && i < 12 && s.den / i < 12) t.push(i)
      }
      if (t.length > 0) {
        res = buildFracWithDen(Helper.randomChoice(t), ganze)
      }
    }
    if (!res) {
      res = buildFracWithDen(s.den, ganze)
    }
    if (s.sub(res).sign() == 'pos' && s.sub(res).num != 0 && res.num != 0)
      return res
    else return null
  }

  free(): [Frac, Frac] {
    // Benutze Pair, um ein entsprechendes Paar zu erzeugen
    let den = 1
    let ganze = 0

    const disc = Math.random()
    if (disc < 0.4) {
      den = Helper.zufallszahl(2, 10)
    } else if (disc < 0.85) {
      const f1 = Helper.zufallszahl(2, 10)
      const f2 = Helper.zufallszahl(2, 10)
      den = f1 * f2
    } else if (disc < 0.95) {
      den = Helper.zufallszahl(11, 50)
    }
    if (Math.random() < 0.3) ganze = 4
    const p = buildFracWithDen(den, ganze)
    const q = Helper.sampleSearch(
      () => this.pair(p),
      f => f !== null,
      p
    ) as Frac

    return Helper.shuffle2([p, q])
  }
}

/*class EinfacheBruchMultDiv implements Form<Frac> {

    ops: Operator[] = ["mul", "div"]
    key: string = moduleKey

  }*/

class SimpleVeto implements Veto<Frac> {
  key: string = moduleKey

  check(type: ExpressionType, val: Frac, _ctxt?: Frac): boolean {
    return val.sign() == 'pos' && val.den <= 10 && val.num <= 30
  }
}
export function register() {
  MainCatalog.registerForm(new EinfacheBruchAddSub())
  MainCatalog.registerVeto(new SimpleVeto())
}
/*


  class BruchrechnungMulDiv implements Form<Frac> {
    ops: Operator[] = ["mul", "div"]
    key: string = moduleKey

    pair(f: Frac) {
      // Zwei Zahlen, die multipliziert ein sinnvolles Ergebnis bilden ...
      if (f.num > 50 || f.den > 50) {
        return null
      }
      let [num, den] = Helper.sampleSearch(
        () => [Helper.zufallszahl(1, 20), Helper.zufallszahl(2, 20)],
        ([num, den]) => {
          let t = new Frac(num * f.num, den * f.den)
          return t.num < 100 && t.den < 100
        },
        [3, 4])
      return new Frac(num, den)
    }

    split(p: Frac) {
      if (p.num < 3 || p.den < 3)
        return null

      let [newnum, newden] = Helper.sampleSearch(
        () => [Helper.zufallszahl(2, p.num - 1), Helper.zufallszahl(2, p.den - 1)],
        ([num, den]) => (p.num * den)  % num == 0 && (p.den * num) % den == 0,
        [1, 1])
      if (newnum == 1 || newden == 1)
        return null
      return new Frac(newnum, newden)
    }

    free(): [Frac, Frac] {
      let res = new Frac(Helper.zufallszahl(2, 20), Helper.zufallszahl(2, 20))
      let other = Helper.sampleSearch(() => this.pair(res), (f) => f !== null, rSimpleFrac())!
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

/*MainCatalog.registerForm(new BruchrechnungEinfachAddSub())
  MainCatalog.registerForm(new BruchrechnungMulDiv())
  MainCatalog.registerVeto(new SimpleVeto())*/
/*MainCatalog.registerNForm(new ExotischeMulDiv())
  MainCatalog.registerNForm(new BoringStandardDivision())
  MainCatalog.registerNForm(new QuadratzahlenBis100())*/
