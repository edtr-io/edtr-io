import { TNode } from './05_TNode'

// Ein Element, dass als TeX dargestellt werden kann
export interface TeXable {
  toTeX(): string
}

// Knotentypen eines TNode
export type NodeType =
  | 'plus'
  | 'minus'
  | 'mal'
  | 'geteilt'
  | 'potenz'
  | 'zahl'
  | 'loch'

// Optionen für die Erzeugung eines Baums
export interface ComposerOptions {
  plusRel: number
  minusRel: number
  malRel: number
  geteiltRel: number
  potenzRel: number

  plusMax: number
  minusMax: number
  malMax: number
  geteiltMax: number
  potenzMax: number

  termpotenz: boolean

  tiefe: number

  maxTriesPerNode: number
  maxGrowTries: number
  maxNodeTries: number

  debugOutput: boolean
}

// Füllt einen Knoten mit Werten auf
export interface Generator {
  (action: string, v1: TeXable, v2: TeXable, v3: TeXable):
    | [TeXable, TeXable, TeXable]
    | null
}

// Generatoren für alle Knotentypen
export interface GeneratorSet {
  plus: Generator
  minus: Generator
  mal: Generator
  geteilt: Generator
  potenz: Generator
  choice(c0: TNode[], c1: TNode[], c2: TNode[]): TNode
  zahl(): TeXable
}

export interface GeneratorBlueprint<T> {
  isValid(p1: T, p2: T, res: T): boolean
  completeRes(p1: T, p2: T): T | null
  completeP2(p1: T, res: T): T | null
  completeP1(p2: T, res: T): T | null
  gendepP1(p1: T): [T, T] | null
  gendepP2(p2: T): [T, T] | null
  gendepRes(res: T): [T, T] | null
  genfree(): [T, T, T]
}

// Ab jetzt kommen Zahlen
export type Signum = 'pos' | 'neg'

// Zahlenartige Strukturen
export interface Numeric extends TeXable {
  add(num: Numeric): Numeric
  sub(num: Numeric): Numeric
  mul(num: Numeric): Numeric
  div(num: Numeric): Numeric
  equals(num: Numeric): boolean
  sign(): Signum
  abs(): Numeric
  isZero(): boolean
  negate(): Numeric
}

export type ExpressionType =
  | 'Summand'
  | 'Summe'
  | 'Minuend'
  | 'Subtrahend'
  | 'Differenz'
  | 'Faktor'
  | 'Produkt'
  | 'Divisor'
  | 'Dividend'
  | 'Quotient'

export interface RelMaker<T> {
  addPair(x: T): T | null
  addSplit(x: T): T | null
  addFree(): [T, T]
  subPair(x: T): T | null
  subSplit(x: T): T | null
  subFree(): [T, T]
  mulPair(x: T): T | null
  mulSplit(x: T): T | null
  mulFree(): [T, T]
  divPair(x: T): T | null
  divSplit(x: T): T | null
  divFree(): [T, T]
  powExp(x: T): T | null
  powFree(): [T, T]
  numFree(): T
  wellComplete(type: ExpressionType, val: T, ctxt?: T): boolean
}

export type Operator = 'add' | 'sub' | 'mul' | 'div' | 'pow'

export interface Form<T> {
  ops: Operator[]
  key: string
  split(x: T): T | null
  pair(x: T): T | null
  free(): [T, T]
}

export interface Veto<T> {
  check(type: ExpressionType, val: T, ctxt?: T): boolean
  key: string
}

export interface Catalog<T> {
  retrieve(op: Operator): Form<T>
  check(type: ExpressionType, val: T, ctxt?: T): boolean
}

export type OutputMode = 'fractional' | 'decimal' | 'percent' | 'no-mixed'
