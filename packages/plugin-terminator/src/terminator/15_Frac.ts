import { Numeric, Signum, OutputMode } from './00_Declarations'
import * as Helper from './01_Helper'

export class Frac implements Numeric {
  readonly num: number
  readonly den: number
  private sig: Signum
  outMode: OutputMode

  constructor(
    num = 1,
    den = 1,
    sig: Signum = 'pos',
    outMode: OutputMode = 'fractional'
  ) {
    if (den == 0) Helper.fail('Nenner darf nicht null sein!')
    if (num < 0 && sig == 'pos') {
      num = Math.abs(num)
      sig = 'neg'
    }
    if (num < 0 || den < 0) throw 'Zähler und Nenner sollen nicht negativ sein'
    if (num == 0) sig = 'pos'
    this.num = num
    this.den = den
    this.sig = sig
    this.outMode = outMode

    // Bruch kürzen ...
    const cd = Helper.gcd(this.num, this.den)
    this.num /= cd
    this.den /= cd
  }

  equals(_other: Numeric): boolean {
    if (_other instanceof Frac) {
      return (
        this.num == _other.num &&
        this.den == _other.den &&
        this.sig == _other.sig
      )
    }
    throw 'Kein Vergleich möglich'
  }

  add(_other: Numeric): Frac {
    const other = toFrac(_other)
    const newnum =
      applySign(this.num, this.sig) * other.den +
      applySign(other.num, other.sig) * this.den
    const newden = this.den * other.den
    return new Frac(newnum, newden)
  }

  sub(_other: Numeric): Frac {
    const other = toFrac(_other)
    return this.add(other.negate())
  }

  negate(): Frac {
    return new Frac(
      this.num,
      this.den,
      this.sig == 'pos' ? 'neg' : 'pos',
      this.outMode
    )
  }

  mul(_other: Numeric): Frac {
    const other = toFrac(_other)
    const newnum =
      applySign(this.num, this.sig) * applySign(other.num, other.sig)
    return new Frac(newnum, this.den * other.den)
  }

  sign(): Signum {
    return this.sig
  }

  inv(): Frac {
    return new Frac(this.den, this.num, this.sig, this.outMode)
  }

  div(_other: Numeric): Frac {
    const other = toFrac(_other)
    if (other.num == 0) throw 'Division durch Null!'
    return this.mul(other.inv())
  }

  abs(): Frac {
    return new Frac(this.num, this.den, 'pos', this.outMode)
  }

  isZero(): boolean {
    return this.num == 0
  }

  toTeX(): string {
    let inner = ''
    if (this.outMode == 'fractional' || this.outMode == 'no-mixed') {
      if (this.den == 1) {
        inner = this.num.toString()
      } else {
        const ganze = Math.floor(this.num / this.den)
        if (ganze > 0 && this.outMode == 'fractional') {
          inner =
            ' ' +
            ganze.toString() +
            ' \\frac{ ' +
            (this.num - ganze * this.den) +
            ' }{ ' +
            this.den +
            ' } '
        } else inner = ' \\frac{ ' + this.num + ' }{ ' + this.den + ' } '
      }
    } else if (this.outMode == 'decimal') {
      inner = toDec(this.num, this.den)
    } else if (this.outMode == 'percent') {
      inner = toDec(this.num * 100, this.den) + ' \\% '
    }
    if (this.sig == 'pos') return inner
    else return ' \\left( -' + inner + ' \\right) '
  }
}

function applySign(n: number, b: Signum) {
  if (b == 'pos') return n
  else return -n
}

function toDec(n: number, d: number): string {
  const ganze = Math.floor(n / d)

  let rest = n - ganze * d
  if (rest == 0) return ganze.toString()

  const digits: number[] = []
  const rests = [rest]
  let periodic = -1
  while (rest != 0) {
    rest *= 10
    const x = Math.floor(rest / d)
    rest -= x * d
    digits.push(x)
    const p = rests.indexOf(rest)
    if (p < 0) {
      rests.push(rest)
    } else {
      periodic = p
      break
    }
  }

  let periodString = ''
  if (periodic >= 0) {
    const ps = digits.splice(periodic)
    periodString = ' \\overline{' + ps.join('') + '} '
  }

  return ' ' + ganze + '{,}' + digits.join('') + periodString
}

function toFrac(n: Numeric): Frac {
  if (!(n instanceof Frac))
    throw 'Ein Bruch kann nicht mit Nicht-Brüchen rechnen!'
  return n
}
