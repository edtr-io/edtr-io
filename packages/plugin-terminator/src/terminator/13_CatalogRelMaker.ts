import { RelMaker, Catalog, Operator, ExpressionType } from './00_Declarations'
import * as Helper from './01_Helper'

export class CatalogRelMaker<T> implements RelMaker<T> {
  private catalog: Catalog<T>

  constructor(cat: Catalog<T>) {
    this.catalog = cat
  }

  private getOp(op: Operator) {
    return this.catalog.retrieve(op)
  }

  addPair(s: T): T | null {
    return this.getOp('add').pair(s)
  }

  addSplit(sum: T): T | null {
    return this.getOp('add').split(sum)
  }

  addFree(): [T, T] {
    return this.getOp('add').free()
  }

  subPair(x: T): T | null {
    return this.getOp('sub').pair(x)
  }

  subSplit(min: T): T | null {
    return this.getOp('sub').split(min)
  }

  subFree(): [T, T] {
    return this.getOp('sub').free()
  }

  mulPair(f: T): T | null {
    return this.getOp('mul').pair(f)
  }

  mulSplit(p: T): T | null {
    return this.getOp('mul').split(p)
  }

  mulFree(): [T, T] {
    return this.getOp('mul').free()
  }

  divPair(x: T): T | null {
    return this.getOp('div').pair(x)
  }

  divSplit(x: T): T | null {
    return this.getOp('div').split(x)
  }

  divFree(): [T, T] {
    return this.getOp('div').free()
  }

  powExp(b: T): T | null {
    return this.getOp('pow').pair(b)
  }

  powFree(): [T, T] {
    return this.getOp('pow').free()
  }

  numFree(): T {
    const numbers = []
    numbers.push(...this.getOp('add').free(), ...this.getOp('mul').free())
    return Helper.randomChoice(numbers)
  }

  wellComplete(type: ExpressionType, val: T, ctxt?: T): boolean {
    return this.catalog.check(type, val, ctxt)
  }
}
