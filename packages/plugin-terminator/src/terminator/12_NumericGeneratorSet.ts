import { Numeric, RelMaker } from './00_Declarations'
import * as Helper from './01_Helper'
import { TNode } from './05_TNode'
import { BuildGenerator } from './11_GeneratorBuilder'

export function NumericGeneratorSet<T extends Numeric>(
  rel: RelMaker<Numeric>,
  negFactor = 0,
  constr: new () => T
) {
  function negate(x: Numeric): Numeric {
    if (Math.random() < negFactor) return x.negate()
    else return x
  }

  function abs(x: Numeric): Numeric {
    if (negFactor > 0) return x.abs()
    else return x
  }

  function findAddPairWithNeg(s1: Numeric): [Numeric, Numeric] | null {
    if (Math.random() < 0.4) {
      let s2 = rel.addPair(abs(s1))
      if (s2 === null) return null
      if (s1.sign() == 'neg') s2 = s2.negate()
      return [s2, s1.add(s2)]
    } else {
      if (Math.random() < 0.5) {
        let s2 = rel.subSplit(abs(s1))
        if (s2 === null) return null
        if (s1.sign() == 'pos') s2 = s2.negate()
        return [s2, s1.add(s2)]
      } else {
        let end = rel.subPair(abs(s1))
        if (end === null) return null
        if (s1.sign() == 'pos') end = end.negate()
        return [end.sub(s1), end]
      }
    }
  }

  function splitAdd(sum: Numeric): [Numeric, Numeric] | null {
    if (sum.sign() == 'neg' && Math.random() < 0.3) {
      let s1 = rel.addSplit(abs(sum))
      if (s1 === null) return null
      s1 = s1.negate()
      return Helper.shuffle2([s1, sum.sub(s1)])
    } else {
      let s1 = rel.subPair(abs(sum))
      if (s1 === null) return null
      let s2 = sum.abs().add(s1)
      if (sum.sign() == 'pos') s1 = s1.negate()
      else s2 = s2.negate()
      return Helper.shuffle2([s1, s2])
    }
  }

  function negShuffle([x, y]: [Numeric, Numeric]): [Numeric, Numeric] {
    const [_x, _y] = Helper.shuffle2([x, y])
    return Helper.shuffle2([_x.negate(), _y])
  }

  return {
    plus: BuildGenerator(
      {
        isValid: (s1, s2, sum) => {
          return (
            s1.add(s2).equals(sum) &&
            ((s1.sign() == 'pos' && s2.sign() == 'pos') || negFactor > 0)
          )
        },
        completeP1: (s2, sum) => {
          if (rel.wellComplete('Summand', abs(sum.sub(s2)))) return sum.sub(s2)
          else return null
        },
        completeP2: (s1, sum) => {
          if (rel.wellComplete('Summand', abs(sum.sub(s1)))) return sum.sub(s1)
          else return null
        },
        completeRes: (s1, s2) => {
          if (rel.wellComplete('Summe', abs(s1.add(s2)))) return s1.add(s2)
          else return null
        },
        gendepP1: s1 => {
          if (
            negFactor == 0 ||
            (s1.sign() == 'pos' && Math.random() > negFactor)
          ) {
            const s2 = rel.addPair(abs(s1))
            if (s2 === null) return null
            return [s2, s1.add(s2)]
          } else {
            return findAddPairWithNeg(s1)
          }
        },
        gendepP2: s2 => {
          if (
            negFactor == 0 ||
            (s2.sign() == 'pos' && Math.random() > negFactor)
          ) {
            const s1 = rel.addPair(abs(s2))
            if (s1 === null) return null
            return [s1, s1.add(s2)]
          } else {
            return findAddPairWithNeg(s2)
          }
        },
        gendepRes: sum => {
          if (
            negFactor == 0 ||
            (sum.sign() == 'pos' && Math.random() >= negFactor)
          ) {
            const s1 = rel.addSplit(abs(sum))
            if (s1 === null) return null
            return [s1, sum.sub(s1)]
          } else {
            return splitAdd(sum)
          }
        },
        genfree: () => {
          if (negFactor == 0 || Math.random() > negFactor) {
            const [s1, s2] = rel.addFree()
            return [s1, s2, s1.add(s2)]
          } else {
            if (Math.random() < 0.3) {
              let [s1, s2] = rel.addFree()
              s1 = s1.negate()
              s2 = s2.negate()
              return [s1, s2, s1.add(s2)]
            } else {
              const [x, y] = Helper.shuffle2(rel.subFree())
              const z = x.add(y)
              // Verpackung in eine Plus-Rechnung mit Z
              const [s1, s2] = negShuffle([x, z])
              return [s1, s2, s1.add(s2)]
            }
          }
        }
      },
      constr
    ),

    minus: BuildGenerator(
      {
        isValid: (min, sub, diff) => {
          return (
            sub.add(diff).equals(min) &&
            ((sub.sign() == 'pos' && diff.sign() == 'pos') || negFactor > 0)
          )
        },
        completeRes: (min, sub) => {
          if (rel.wellComplete('Differenz', abs(min.sub(sub))))
            return min.sub(sub)
          else return null
        },
        completeP1: (sub, diff) => {
          if (rel.wellComplete('Minuend', abs(diff.add(sub))))
            return diff.add(sub)
          else return null
        },
        completeP2: (min, diff) => {
          if (rel.wellComplete('Subtrahend', abs(min.sub(diff))))
            return min.sub(diff)
          else return null
        },
        gendepP1: min => {
          if (
            negFactor == 0 ||
            (min.sign() == 'pos' && Math.random() >= negFactor)
          ) {
            const sub = rel.subSplit(abs(min))
            if (sub === null) return null
            return [sub, min.sub(sub)]
          } else {
            return splitAdd(min)
          }
        },
        gendepP2: sub => {
          if (
            negFactor == 0 ||
            (sub.sign() == 'pos' && Math.random() > negFactor)
          ) {
            const diff = rel.subPair(abs(sub))
            if (diff === null) return null
            return [sub.add(diff), diff]
          } else {
            const res = findAddPairWithNeg(sub)
            if (res === null) return null
            const [b, a] = res
            return [a, b]
          }
        },
        gendepRes: diff => {
          if (
            negFactor == 0 ||
            (diff.sign() == 'pos' && Math.random() > negFactor)
          ) {
            const sub = rel.subPair(abs(diff))
            if (sub === null) return null
            return [sub.add(diff), sub]
          } else {
            const res = findAddPairWithNeg(diff)
            if (res === null) return null
            const [b, a] = res
            return [a, b]
          }
        },
        genfree: () => {
          if (negFactor == 0 || Math.random() > negFactor) {
            const [s1, s2] = rel.subFree()
            return [s1.add(s2), s1, s2]
          } else {
            if (Math.random() < 0.3) {
              const [min, sub] = negShuffle(rel.addFree())
              return [min, sub, min.sub(sub)]
            } else {
              const [x, y] = Helper.shuffle2(rel.subFree())
              const z = x.add(y)
              let [min, sub] = Helper.shuffle2([x, z])
              if (Math.random() < 0.4) {
                min = min.negate()
                sub = sub.negate()
              } else {
                if (min.sub(sub).sign() == 'pos') {
                  const t = min
                  min = sub
                  sub = t
                }
              }
              return [min, sub, min.sub(sub)]
            }
          }
        }
      },
      constr
    ),

    mal: BuildGenerator(
      {
        isValid: (f1, f2, prod) => {
          return (
            f1.mul(f2).equals(prod) &&
            ((f1.sign() == 'pos' && f2.sign() == 'pos') || negFactor > 0)
          )
        },
        completeRes: (f1, f2) => {
          if (rel.wellComplete('Produkt', abs(f1.mul(f2)))) return f1.mul(f2)
          else return null
        },
        completeP1: (f2, prod) => {
          const f1 = prod.div(f2)
          if (f1.mul(f2).equals(prod) && rel.wellComplete('Faktor', abs(f1)))
            return f1
          else return null
        },
        completeP2: (f1, prod) => {
          const f2 = prod.div(f1)
          if (f1.mul(f2).equals(prod) && rel.wellComplete('Faktor', abs(f2)))
            return f2
          else return null
        },
        gendepP1: f1 => {
          let f2 = rel.mulPair(abs(f1))
          if (f2 === null) return null
          f2 = negate(f2)
          return [f2, f1.mul(f2)]
        },
        gendepP2: f2 => {
          let f1 = rel.mulPair(abs(f2))
          if (f1 === null) return null
          f1 = negate(f1)
          return [f1, f1.mul(f2)]
        },
        gendepRes: prod => {
          let f = rel.mulSplit(abs(prod))
          if (f === null) return null
          f = negate(f)
          return Helper.shuffle2([f, prod.div(f)])
        },
        genfree: () => {
          let [f1, f2] = rel.mulFree()
          if (Math.random() < negFactor) {
            const n = Helper.zufallszahl(0, 30)
            if (n < 10) {
              f1 = f1.negate()
              f2 = f2.negate()
            } else if (n < 20) {
              f2 = f2.negate()
            } else {
              f1 = f1.negate()
            }
          }
          return [f1, f2, f1.mul(f2)]
        }
      },
      constr
    ),

    geteilt: BuildGenerator(
      {
        isValid: (z, n, quo) => {
          return quo.mul(n).equals(z) && !n.isZero()
        },
        completeRes: (z, n) => {
          const quo = z.div(n)
          if (
            quo.mul(n).equals(z) &&
            rel.wellComplete('Quotient', abs(quo), abs(n))
          )
            return quo
          else return null
        },
        completeP1: (n, quo) => {
          if (rel.wellComplete('Dividend', abs(quo.mul(n)))) return quo.mul(n)
          else return null
        },
        completeP2: (z, quo) => {
          const n = z.div(quo)
          if (
            quo.mul(n).equals(z) &&
            rel.wellComplete('Divisor', abs(n), abs(quo))
          )
            return n
          else return null
        },
        gendepP1: z => {
          let t = rel.divSplit(abs(z))
          if (t === null) return null
          t = negate(t)
          return Helper.shuffle2([t, z.div(t)])
        },
        gendepP2: n => {
          let quo = rel.divPair(abs(n))
          if (quo === null) return null
          quo = negate(quo)
          return [n.mul(quo), quo]
        },
        gendepRes: quo => {
          let n = rel.divPair(abs(quo))
          if (n === null) return null
          n = negate(n)
          return [n.mul(quo), n]
        },
        genfree: () => {
          let [n, quo] = rel.divFree()
          if (Math.random() < negFactor) {
            const r = Helper.zufallszahl(0, 30)
            if (r < 10) {
              quo = quo.negate()
              n = n.negate()
            } else if (r < 20) {
              quo = quo.negate()
            } else {
              n = n.negate()
            }
          }
          return [n.mul(quo), n, quo]
        }
      },
      constr
    ),

    potenz: BuildGenerator(
      {
        isValid: (b, e, p) => {
          return (
            !b.isZero() &&
            !e.isZero() &&
            (negFactor > 0 || b.sign() == 'pos') &&
            numPow(b, e).equals(p)
          )
        },
        completeRes: (_b, _e) => {
          return null
        },
        completeP1: (_e, _pow) => {
          return null
        },
        completeP2: (_b, _pow) => {
          return null
        },
        gendepP1: b => {
          const e = rel.powExp(abs(b))
          if (e === null) return null
          else return [e, numPow(b, e)]
        },
        gendepP2: _e => {
          return null
        },
        gendepRes: _pow => {
          return null
        },
        genfree: () => {
          const res = rel.powFree()
          res[0] = negate(res[0])
          const [b, e] = res
          return [b, e, numPow(b, e)]
        }
      },
      constr
    ),

    choice: function(c0: TNode[], c1: TNode[], c2: TNode[]): TNode {
      const scoreMatrix = {
        genFree: {
          plus: 0,
          minus: 0,
          mal: 10,
          geteilt: 10,
          potenz: 20
        },
        genDep: {
          plus: 5,
          minus: 5,
          mal: 20,
          geteilt: 20,
          potenz: 40
        },
        complete: {
          plus: 50,
          minus: 50,
          mal: 70,
          geteilt: 70,
          potenz: 100
        }
      }
      const ranking: any = []
      c0.forEach(node => {
        ranking.push({
          node,
          score: (scoreMatrix.genFree as any)[node.type] + Math.random() - 0.5
        })
      })
      c1.forEach(node => {
        ranking.push({
          node,
          score: (scoreMatrix.genDep as any)[node.type] + Math.random() - 0.5
        })
      })
      c2.forEach(node => {
        ranking.push({
          node,
          score: (scoreMatrix.complete as any)[node.type] + Math.random() - 0.5
        })
      })
      ranking.sort((r1: any, r2: any) => {
        return r2.score - r1.score
      })
      //console.log(ranking)
      return ranking[0].node
    },

    zahl: () => {
      return rel.numFree()
    }
  }
}

function numPow(b: Numeric, e: Numeric): Numeric {
  const zero = b.sub(b)
  const one = e.div(e)
  let res = one
  let c = zero.add(e)
  while (c.sub(one).sign() == 'pos') {
    res = res.mul(b)
    c = c.sub(one)
  }
  return res
}
