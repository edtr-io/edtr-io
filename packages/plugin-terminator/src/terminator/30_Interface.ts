import { ComposerOptions } from './00_Declarations'
import { TNode } from './05_TNode'
import { ComposerDo } from './10_Composer'
import { NumericGeneratorSet } from './12_NumericGeneratorSet'
import { CatalogRelMaker } from './13_CatalogRelMaker'
import { Frac } from './15_Frac'
import { MainCatalog } from './20_MainCatalog'
import * as _21_01 from './21_01_KopfrechnenEasy'
import * as _21_02 from './21_02_KopfrechnenMedium'
import * as _21_03 from './21_03_KopfrechnenExcotic'
import * as _21_04 from './21_04_BoringStandard'
import * as _21_05 from './21_05_FracBasic'
import * as _21_06 from './21_06_FracEasy'

_21_01.register()
_21_02.register()
_21_03.register()
_21_04.register()
_21_05.register()
_21_06.register()

export interface InterfaceOptions {
  catalog: string
  addition: number
  multiplication: number
  subtraction: number
  division: number
  power: number
  size: number
  negative: number
  decimals: boolean
  noMixed: boolean
  termPower?: boolean
  debug?: boolean
  divAsFrac?: boolean
}

export function Create(options: InterfaceOptions): TNode {
  // Parsen eines Beschreibungstexts und daraus dann die richtigen Optionen ablesen

  let negFactor = 0
  if (options.negative == 1) negFactor = 0.2
  if (options.negative == 2) negFactor = 0.3
  if (options.negative == 3) negFactor = 0.7

  const depthNum = options.size

  const opts: ComposerOptions = {
    plusRel: 6,
    minusRel: 5,
    malRel: 4,
    geteiltRel: 2,
    potenzRel: 1,
    plusMax: -1,
    minusMax: -1,
    malMax: 3,
    geteiltMax: 2,
    potenzMax: 1,
    tiefe: depthNum,
    maxTriesPerNode: 4,
    maxGrowTries: 15,
    maxNodeTries: 2000,
    termpotenz: !!options.termPower,
    debugOutput: !!options.debug
  }

  if (opts.tiefe >= 10) opts.maxNodeTries *= 2

  opts.plusRel *= options.addition
  opts.minusRel *= options.subtraction
  opts.malRel *= options.multiplication
  opts.geteiltRel *= options.division
  opts.potenzRel *= options.power

  /*for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].match(/^max[p\-\\*d\\^]\\-?\d+$/)) {
      const op = tokens[i].charAt(3)
      const num = parseInt(tokens[i].substring(4))
      if (op == 'p') {
        opts.plusMax = num
      }
      if (op == '-') {
        opts.minusMax = num
      }
      if (op == '*') {
        opts.malMax = num
      }
      if (op == 'd') {
        opts.geteiltMax = num
      }
      if (op == '^') {
        opts.potenzMax = num
      }
    }
  }*/

  let result: TNode | null = null

  result = ComposerDo(
    NumericGeneratorSet<Frac>(
      new CatalogRelMaker<Frac>(new MainCatalog([options.catalog])),
      negFactor,
      Frac
    ),
    opts
  )

  if (result == null) {
    throw new Error('Leider konnte kein Term gefunden werden!')
  } //

  if (options.divAsFrac) {
    result.divAsFrac = true
  }

  // Postprozess mit alternativen Darstellungen
  if (options.decimals) {
    result.traverse(n => {
      chooseOutMode(n.value as Frac)
    })
  }

  if (options.noMixed) {
    result.traverse(n => {
      if ((n.value as Frac).outMode == 'fractional')
        (n.value as Frac).outMode = 'no-mixed'
    })
  }

  return result
}

const approvedDen = [1, 2, 4, 5, 8, 10, 20, 50, 100]

function chooseOutMode(f: Frac) {
  if (approvedDen.includes(f.den)) {
    // Als Dezimalzahl darstellbar
    const disc = Math.random()
    if (disc < 0.9) {
      f.outMode = 'decimal'
    } else {
      f.outMode = 'percent'
    }
  } else {
    f.outMode = 'decimal'
    const tex = f.toTeX()
    const digits = (tex.match(/\d/g) as RegExpMatchArray).length
    f.outMode = 'fractional'
    if (digits <= 2 && Math.random() < 0.3) {
      f.outMode = 'decimal'
    }
  }
}
