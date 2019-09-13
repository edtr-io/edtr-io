import {
  StateDescriptor,
  StateType,
  StoreDeserializeHelpers,
  StoreSerializeHelpers
} from '@edtr-io/abstract-plugin-state'

export function migratable<S, T, R>(
  type: StateType<S, T, R>
): MigratableStateType<S, S, S, T, R> {
  return migrate<S, S, S, T, R, S, T, R>(
    state => {
      if (legacyIsVersionized(state, 0)) {
        return state.value
      }
      return state
    },
    type,
    0,
    state => state
  )
}

/** @deprecated */
export function legacyMigratable<S, T, R>(
  type: StateDescriptor<S, T, R>
): MigratableStateDescriptor<S, S, S, T, R> {
  const state: AbstractMigratableStateDescriptor<S, S, S, T, R> = Object.assign(
    function(
      value: T,
      onChange: (
        updater: (oldValue: T, helpers: StoreDeserializeHelpers) => T
      ) => void,
      pluginProps?: unknown
    ): R {
      return type(value, onChange, pluginProps)
    },
    {
      createInitialState(helpers: StoreDeserializeHelpers) {
        return type.createInitialState(helpers)
      },
      deserialize(
        serialized: S | Versionized<S>,
        helpers: StoreDeserializeHelpers
      ) {
        if (legacyIsVersionized(serialized, 0)) {
          return type.deserialize(serialized.value, helpers)
        }
        return type.deserialize(serialized, helpers)
      },
      serialize(
        deserialized: T,
        helpers: StoreSerializeHelpers
      ): Versionized<S> {
        return {
          __version__: 0,
          value: type.serialize(deserialized, helpers)
        }
      },
      recursiveMigrate(previousState: S | Versionized<S>): S {
        if (legacyIsVersionized<S>(previousState, 0)) {
          return previousState.value
        }
        return previousState
      }
    }
  )

  return Object.assign(state, { migrate: nextMigrate })

  function nextMigrate<S1, T1, R1>(
    nextNextType: StateDescriptor<S1, T1, R1>,
    f: (previousState: S) => S1
  ) {
    return legacyMigrate(state, nextNextType, 0, f)
  }
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

    static createInitialState(helpers: StoreDeserializeHelpers) {
      return nextType.createInitialState(helpers)
    }

    static deserialize(
      serialized: InitialS | Versionized<AllS | S1>,
      helpers: StoreDeserializeHelpers
    ): T1 {
      if (legacyIsVersionized<S1>(serialized, nextVersion)) {
        return nextType.deserialize(serialized.value, helpers)
      }
      const s = serialized as InitialS | Versionized<AllS>
      return nextType.deserialize(f(recursiveMigrate(s)), helpers)
    }

    static serialize(
      deserialized: T1,
      helpers: StoreSerializeHelpers
    ): Versionized<S1> {
      return {
        __version__: nextVersion,
        value: nextType.serialize(deserialized, helpers)
      }
    }

    static migrate<S2, T2, R2>(
      nextNextType: StateType<S2, T2, R2>,
      f2: (previousState: S1) => S2
    ): MigratableStateType<InitialS, AllS | S1 | S2, S2, T2, R2> {
      return migrate<InitialS, AllS | S1, S1, T1, R1, S2, T2, R2>(
        (previousState: InitialS | Versionized<AllS | S1>) => {
          if (legacyIsVersionized<S1>(previousState, nextVersion)) {
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

/** @deprecated */
function legacyMigrate<InitialS, AllS, S, T, R, S1, T1, R1>(
  currentType: AbstractMigratableStateDescriptor<InitialS, AllS, S, T, R>,
  nextType: StateDescriptor<S1, T1, R1>,
  currentVersion: number,
  f: (previousState: S) => S1
): MigratableStateDescriptor<InitialS, AllS | S1, S1, T1, R1> {
  const nextVersion = currentVersion + 1
  const state: AbstractMigratableStateDescriptor<
    InitialS,
    AllS | S1,
    S1,
    T1,
    R1
  > = Object.assign(
    function(
      value: T1,
      onChange: (
        updater: (oldValue: T1, helpers: StoreDeserializeHelpers) => T1
      ) => void,
      pluginProps?: unknown
    ): R1 {
      return nextType(value, onChange, pluginProps)
    },
    {
      createInitialState(helpers: StoreDeserializeHelpers) {
        return nextType.createInitialState(helpers)
      },
      deserialize(
        serialized: InitialS | Versionized<AllS | S1>,
        helpers: StoreDeserializeHelpers
      ): T1 {
        if (legacyIsVersionized<S1>(serialized, nextVersion)) {
          return nextType.deserialize(serialized.value, helpers)
        }
        const s = serialized as InitialS | Versionized<AllS>
        return nextType.deserialize(f(currentType.recursiveMigrate(s)), helpers)
      },
      serialize(
        deserialized: T1,
        helpers: StoreSerializeHelpers
      ): Versionized<S1> {
        return {
          __version__: nextVersion,
          value: nextType.serialize(deserialized, helpers)
        }
      },
      recursiveMigrate
    }
  )

  return Object.assign(state, { migrate: nextMigrate })

  function nextMigrate<S2, T2, R2>(
    nextNextType: StateDescriptor<S2, T2, R2>,
    f: (previousState: S1) => S2
  ) {
    return legacyMigrate(state, nextNextType, nextVersion, f)
  }

  function recursiveMigrate(
    previousState: InitialS | Versionized<AllS | S1>
  ): S1 {
    if (legacyIsVersionized<S1>(previousState, nextVersion)) {
      return previousState.value
    }
    return f(
      currentType.recursiveMigrate(previousState as
        | InitialS
        | Versionized<AllS>)
    )
  }
}

/** @deprecated */
function legacyIsVersionized<S>(
  state: unknown,
  version: number
): state is Versionized<S> {
  return (state as Versionized<S>).__version__ === version
}

interface Versionized<S> {
  __version__: number
  value: S
}

/** @deprecated */
interface AbstractMigratableStateDescriptor<InitialS, AllS, S, T, R>
  extends StateDescriptor<InitialS | Versionized<AllS>, T, R> {
  recursiveMigrate: (previousState: InitialS | Versionized<AllS>) => S
}

export interface MigratableStateType<InitialS, AllS, S, T, R>
  extends StateType<InitialS | Versionized<AllS>, T, R> {
  migrate<S1, T1, R1>(
    nextType: StateType<S1, T1, R1>,
    migrate: (previousState: S) => S1
  ): MigratableStateType<InitialS, AllS | S1, S1, T1, R1>
}

/** @deprecated */
export interface MigratableStateDescriptor<InitialS, AllS, S, T, R>
  extends AbstractMigratableStateDescriptor<InitialS, AllS, S, T, R> {
  migrate<S1, T1, R1>(
    nextType: StateDescriptor<S1, T1, R1>,
    migrate: (previousState: S) => S1
  ): MigratableStateDescriptor<InitialS, AllS | S1, S1, T1, R1>
}
