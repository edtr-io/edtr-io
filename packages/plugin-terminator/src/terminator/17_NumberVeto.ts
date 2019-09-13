import { Veto, ExpressionType } from './00_Declarations'
import { Frac } from './15_Frac'

export class NumberVeto implements Veto<Frac> {
  private inner: Veto<number>
  key: string

  constructor(inner: Veto<number>) {
    this.inner = inner
    this.key = inner.key
  }

  check(type: ExpressionType, val: Frac, ctxt?: Frac): boolean {
    if (val.den == 1 && (!ctxt || ctxt.den == 1)) {
      let v = val.num
      if (val.sign() == 'neg') v *= -1
      let c: number | undefined = undefined
      if (ctxt) {
        c = ctxt.num
        if (ctxt.sign() == 'neg') c *= -1
      }
      return this.inner.check(type, v, c)
    }
    return false
  }
}
