import { Generator, TeXable, GeneratorBlueprint } from './00_Declarations'

export function BuildGenerator<T extends TeXable>(
  mkr: GeneratorBlueprint<T>,
  constr: new () => T
): Generator {
  return function(
    action: string,
    p1: any,
    p2: any,
    res: any
  ): [T, T, T] | null {
    switch (action) {
      case 'validate':
        if (
          p1 instanceof constr &&
          p2 instanceof constr &&
          res instanceof constr
        ) {
          if (mkr.isValid(p1, p2, res)) {
            return [p1, p2, res]
          }
        }
        return null
      case 'complete':
        if (p1 instanceof constr && p2 instanceof constr) {
          const newres = mkr.completeRes(p1, p2)
          if (newres === null) return null
          if (mkr.isValid(p1, p2, newres)) {
            return [p1, p2, newres]
          } else {
            console.log(p1.toTeX() + ', ' + p2.toTeX() + ', ' + newres.toTeX())
            console.log('completeres scheint fehlerhaft zu sein')
            return null
          }
        }
        if (p1 instanceof constr && res instanceof constr) {
          const newp2 = mkr.completeP2(p1, res)
          if (newp2 === null) return null
          if (mkr.isValid(p1, newp2, res)) {
            return [p1, newp2, res]
          } else {
            console.log(p1.toTeX() + ', ' + newp2.toTeX() + ', ' + res.toTeX())
            console.log('completep2 scheint fehlerhaft zu sein')
            return null
          }
        }
        if (p2 instanceof constr && res instanceof constr) {
          const newp1 = mkr.completeP1(p2, res)
          if (newp1 === null) return null
          if (mkr.isValid(newp1, p2, res)) {
            return [newp1, p2, res]
          } else {
            console.log(newp1.toTeX() + ', ' + p2.toTeX() + ', ' + res.toTeX())
            console.log('completep1 scheint fehlerhaft zu sein')
            return null
          }
        }
        throw 'Ungültiger complete-Aufruf!'
      case 'gen_dep':
        if (p1 instanceof constr) {
          const result = mkr.gendepP1(p1)
          if (result === null) return null
          const [newp2, newres] = result
          if (mkr.isValid(p1, newp2, newres)) {
            return [p1, newp2, newres]
          } else {
            console.log('gendepP1 scheint fehlerhaft zu sein')
            return null
          }
        }
        if (p2 instanceof constr) {
          const result = mkr.gendepP2(p2)
          if (result === null) return null
          const [newp1, newres] = result
          if (mkr.isValid(newp1, p2, newres)) {
            return [newp1, p2, newres]
          } else {
            console.log('gendepP2 scheint fehlerhaft zu sein')
            return null
          }
        }
        if (res instanceof constr) {
          const result = mkr.gendepRes(res)
          if (result === null) return null
          const [newp1, newp2] = result
          if (mkr.isValid(newp1, newp2, res)) {
            return [newp1, newp2, res]
          } else {
            console.log('gendepRes scheint fehlerhaft zu sein')
            return null
          }
        }
        throw 'Ungültiger gen_dep-Aufruf!'
      case 'gen_free': {
        const [newp1, newp2, newres] = mkr.genfree()
        if (mkr.isValid(newp1, newp2, newres)) {
          return [newp1, newp2, newres]
        } else {
          console.log('genfree scheint fehlerhaft zu sein')
          return null
        }
      }
    }
    throw 'Unbekannte Aktion!'
  }
}
