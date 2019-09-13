import {
  Catalog,
  Form,
  Veto,
  Operator,
  ExpressionType
} from './00_Declarations'
import * as Helper from './01_Helper'
import { Frac } from './15_Frac'
import { NumberForm } from './16_NumberForm'
import { NumberVeto } from './17_NumberVeto'

export class MainCatalog implements Catalog<Frac> {
  private static formStore: Form<Frac>[] = []
  private static vetoStore: Veto<Frac>[] = []

  private forms: Form<Frac>[] = []
  private vetos: Veto<Frac>[] = []

  static registerForm(form: Form<Frac>) {
    this.formStore.push(form)
  }

  static registerNForm(form: Form<number>) {
    this.formStore.push(new NumberForm(form))
  }

  static registerVeto(veto: Veto<Frac>) {
    this.vetoStore.push(veto)
  }

  static registerNVeto(veto: Veto<number>) {
    this.vetoStore.push(new NumberVeto(veto))
  }

  constructor(keys: string[]) {
    this.forms = MainCatalog.formStore.filter(f => keys.includes(f.key))
    this.vetos = MainCatalog.vetoStore.filter(v => keys.includes(v.key))
  }

  retrieve(op: Operator): Form<Frac> {
    const candidates = this.forms.filter(form => form.ops.includes(op))
    if (candidates.length == 0) Helper.fail('Katalog unvollständig')
    return Helper.randomChoice(candidates)
  }

  check(type: ExpressionType, val: Frac, ctxt?: Frac): boolean {
    return this.vetos.every(v => v.check(type, val, ctxt))
  }
}
