import {
  StateType,
  StoreDeserializeHelpers,
  StoreSerializeHelpers,
} from './internal-plugin-state'

/**
 * @param type - The initial {@link @edtr-io/internal__plugin-state#StateType | state type} to start the migration from
 * @public
 */
export function migratable<S, T, R>(
  type: StateType<S, T, R>
): MigratableStateType<S, S, S, T, R> {
  return migrate<S, never, S, S, T, R>(
    (state) => {
      return state as S
    },
    type,
    0,
    (state) => state
  )
}

function migrate<InitialS, AllS, S, S1, T1, R1>(
  recursiveMigrate: (previousState: InitialS | Versionized<AllS>) => S,
  nextType: StateType<S1, T1, R1>,
  nextVersion: number,
  f: (previousState: S) => S1
): MigratableStateType<InitialS, AllS | S1, S1, T1, R1> {
  return {
    ...nextType,
    deserialize(
      serialized: InitialS | Versionized<AllS | S1>,
      helpers: StoreDeserializeHelpers
    ) {
      if (isVersionized<S1>(serialized, nextVersion)) {
        return nextType.deserialize(serialized.value, helpers)
      }
      const s = serialized as InitialS | Versionized<AllS>
      return nextType.deserialize(f(recursiveMigrate(s)), helpers)
    },
    serialize(
      deserialized: T1,
      helpers: StoreSerializeHelpers
    ): Versionized<S1> {
      return {
        __version__: nextVersion,
        value: nextType.serialize(deserialized, helpers),
      }
    },
    migrate<S2, T2, R2>(
      nextNextType: StateType<S2, T2, R2>,
      f2: (previousState: S1) => S2
    ): MigratableStateType<InitialS, AllS | S1 | S2, S2, T2, R2> {
      return migrate<InitialS, AllS | S1, S1, S2, T2, R2>(
        (previousState: InitialS | Versionized<AllS | S1>) => {
          if (isVersionized<S1>(previousState, nextVersion)) {
            return previousState.value
          }
          return f(
            recursiveMigrate(previousState as InitialS | Versionized<AllS>)
          )
        },
        nextNextType,
        nextVersion + 1,
        f2
      )
    },
  }
}

function isVersionized<S>(
  state: unknown,
  version: number
): state is Versionized<S> {
  return (state as Versionized<S>).__version__ === version
}

/** @public */
export interface Versionized<S> {
  __version__: number
  value: S
}

/** @public */
export interface MigratableStateType<InitialS, AllS, S, T, R>
  extends StateType<InitialS | Versionized<AllS>, T, R> {
  migrate<S1, T1, R1>(
    nextType: StateType<S1, T1, R1>,
    migrate: (previousState: S) => S1
  ): MigratableStateType<InitialS, AllS | S1, S1, T1, R1>
}
