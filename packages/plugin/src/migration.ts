import {
  StateType,
  StoreDeserializeHelpers,
  StoreSerializeHelpers
} from '@edtr-io/abstract-plugin-state'

export function migratable<S, T, R>(
  type: StateType<S, T, R>
): MigratableStateType<S, S, S, T, R> {
  return migrate<S, S, S, T, R, S, T, R>(
    state => {
      if (isVersionized(state, 0)) {
        return state.value
      }
      return state
    },
    type,
    0,
    state => state
  )
}

function migrate<InitialS, AllS, S, T, R, S1, T1, R1>(
  recursiveMigrate: (previousState: InitialS | Versionized<AllS>) => S,
  nextType: StateType<S1, T1, R1>,
  nextVersion: number,
  f: (previousState: S) => S1
): MigratableStateType<InitialS, AllS | S1, S1, T1, R1> {
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  class MigrateType {
    constructor(
      value: T1,
      onChange: (
        updater: (oldValue: T1, helpers: StoreDeserializeHelpers) => T1
      ) => void,
      pluginProps?: unknown
    ) {
      Object.assign(this, new nextType(value, onChange, pluginProps))
    }

    public static createInitialState(helpers: StoreDeserializeHelpers) {
      return nextType.createInitialState(helpers)
    }

    public static deserialize(
      serialized: InitialS | Versionized<AllS | S1>,
      helpers: StoreDeserializeHelpers
    ): T1 {
      if (isVersionized<S1>(serialized, nextVersion)) {
        return nextType.deserialize(serialized.value, helpers)
      }
      const s = serialized as InitialS | Versionized<AllS>
      return nextType.deserialize(f(recursiveMigrate(s)), helpers)
    }

    public static serialize(
      deserialized: T1,
      helpers: StoreSerializeHelpers
    ): Versionized<S1> {
      return {
        __version__: nextVersion,
        value: nextType.serialize(deserialized, helpers)
      }
    }

    public static migrate<S2, T2, R2>(
      nextNextType: StateType<S2, T2, R2>,
      f2: (previousState: S1) => S2
    ): MigratableStateType<InitialS, AllS | S1 | S2, S2, T2, R2> {
      return migrate<InitialS, AllS | S1, S1, T1, R1, S2, T2, R2>(
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
    }
  }

  return MigrateType as MigratableStateType<InitialS, AllS | S1, S1, T1, R1>
}

function isVersionized<S>(
  state: unknown,
  version: number
): state is Versionized<S> {
  return (state as Versionized<S>).__version__ === version
}

interface Versionized<S> {
  __version__: number
  value: S
}

export interface MigratableStateType<InitialS, AllS, S, T, R>
  extends StateType<InitialS | Versionized<AllS>, T, R> {
  migrate<S1, T1, R1>(
    nextType: StateType<S1, T1, R1>,
    migrate: (previousState: S) => S1
  ): MigratableStateType<InitialS, AllS | S1, S1, T1, R1>
}
