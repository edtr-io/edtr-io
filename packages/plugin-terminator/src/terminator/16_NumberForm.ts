import { Form, Operator } from './00_Declarations'
import { Frac } from './15_Frac'

export class NumberForm implements Form<Frac> {
  ops: Operator[]
  key: string
  private form: Form<number>

  constructor(form: Form<number>) {
    this.ops = form.ops
    this.key = form.key
    this.form = form
  }

  split(x: Frac): Frac | null {
    if (x.den == 1) {
      let n = x.num
      if (x.sign() == 'neg') n *= -1
      const result = this.form.split(n)
      if (result === null) return null
      return new Frac(result)
    }
    return null
  }

  pair(x: Frac): Frac | null {
    if (x.den == 1) {
      let n = x.num
      if (x.sign() == 'neg') n *= -1
      const result = this.form.pair(n)
      if (result === null) return null
      return new Frac(result)
    }
    return null
  }

  free(): [Frac, Frac] {
    const [x, y] = this.form.free()
    return [new Frac(x), new Frac(y)]
  }
}
